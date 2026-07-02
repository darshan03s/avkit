import { ConversionError } from '@/errors'
import { useFile } from '@/store/use-file'
import { SupportedOutputFormat, TrackData } from '@/types/mediabunny'
import { getExtension, getFilename, saveOutput } from '@/utils'
import {
  getOutputFormatForInputFormat,
  supportedOutputFormats,
  verifyDecodability,
  verifyEncodability
} from '@/utils/mediabunny'
import {
  AudioCodec,
  BufferTarget,
  Conversion,
  ConversionOptions,
  Output,
  OutputOptions,
  Quality,
  Rotation,
  VideoCodec
} from 'mediabunny'
import { useState } from 'react'

type ExecuteOptions = {
  format: SupportedOutputFormat
  trim: {
    start: number
    end: number
  }
  trackToExtract: TrackData
  type: 'audio' | 'video'
  codec: AudioCodec | VideoCodec
  frameRate: string
  crop: {
    left: number
    top: number
    width: number
    height: number
  }
  trackIdsToDiscard: Set<number>
  resize: {
    width: number
    height: number
    fit: 'fill' | 'contain' | 'cover'
  }
  quality: Quality
  rotation: Rotation
  removeMetadata: boolean
}

export function useConversion() {
  const [progress, setProgress] = useState(0)
  const [conversion, setConversion] = useState<Conversion | null>(null)
  const { fileInput, file } = useFile()

  const input = fileInput!

  function onProgress(progress: number) {
    setProgress(Math.trunc(progress * 100))
  }

  async function execute(options: Partial<ExecuteOptions>) {
    await verifyDecodability(input)

    const {
      format,
      trim,
      trackToExtract,
      type,
      codec,
      frameRate,
      crop,
      trackIdsToDiscard,
      resize,
      quality,
      rotation,
      removeMetadata
    } = options

    if (type && codec) {
      verifyEncodability(type, codec)
    }

    const inputFormat = await input.getFormat()

    const outputOptions: OutputOptions = {
      format: getOutputFormatForInputFormat(inputFormat),
      target: new BufferTarget()
    }

    if (format) {
      outputOptions.format = supportedOutputFormats[format]()
    }

    const output = new Output(outputOptions)

    const conversionOptions: ConversionOptions = {
      input,
      output
    }

    if (trim) {
      conversionOptions.trim = trim
    }

    if (trackToExtract) {
      if (trackToExtract.type === 'video') {
        conversionOptions.audio = {
          discard: true
        }

        conversionOptions.video = (videoTrack) => ({
          discard: videoTrack.id !== trackToExtract.id
        })
      } else if (trackToExtract.type === 'audio') {
        conversionOptions.video = {
          discard: true
        }

        conversionOptions.audio = (audioTrack) => ({
          discard: audioTrack.id !== trackToExtract.id
        })
      }
    }

    if (type && codec) {
      if (type === 'audio') {
        conversionOptions.audio = {
          codec: codec as AudioCodec
        }
      } else if (type === 'video') {
        conversionOptions.video = {
          codec: codec as VideoCodec
        }
      }
    }

    if (frameRate) {
      conversionOptions.video = {
        frameRate: Number(frameRate)
      }
    }

    if (crop) {
      conversionOptions.video = {
        crop
      }
    }

    if (trackIdsToDiscard) {
      conversionOptions.video = (videoTrack) => ({
        discard: trackIdsToDiscard.has(videoTrack.id)
      })

      conversionOptions.audio = (audioTrack) => ({
        discard: trackIdsToDiscard.has(audioTrack.id)
      })
    }

    if (resize) {
      conversionOptions.video = {
        width: resize.width,
        height: resize.height,
        fit: resize.fit
      }
    }

    if (quality) {
      conversionOptions.video = {
        bitrate: quality
      }
    }

    if (rotation) {
      conversionOptions.video = {
        rotate: rotation,
        allowRotationMetadata: false
      }
    }

    if (removeMetadata) {
      conversionOptions.tags = {}
    }

    const conversionInit = await Conversion.init(conversionOptions)

    const unintentionallyDiscarded = conversionInit.discardedTracks

    if (trackIdsToDiscard || trackToExtract) {
      if (!conversionInit.isValid) {
        throw new ConversionError(conversionInit.discardedTracks)
      }
    } else {
      if (unintentionallyDiscarded.length > 0 || !conversionInit.isValid) {
        throw new ConversionError(conversionInit.discardedTracks)
      }
    }

    conversionInit.onProgress = onProgress

    setConversion(conversionInit)

    try {
      await conversionInit.execute()
    } catch (e) {
      setConversion(null)
      throw e
    }
  }

  function reset() {
    setProgress(0)
    setConversion(null)
  }

  async function cancel() {
    if (!conversion) return
    setConversion(null)
    setProgress(0)
    await conversion.cancel()
  }

  function save(format?: SupportedOutputFormat) {
    if (!file || !conversion) return
    if (!format) {
      saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    } else {
      saveOutput(conversion, getFilename(file.name), format)
    }
    reset()
  }

  return {
    progress,
    execute,
    reset,
    cancel,
    conversion,
    save
  }
}
