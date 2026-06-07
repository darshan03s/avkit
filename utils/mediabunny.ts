'use client'

import { ConversionError } from '@/errors'
import {
  InputMediaData,
  SupportedAudioOutputFormat,
  SupportedOutputFormat,
  SupportedVideoOutputFormat
} from '@/types/mediabunny'
import {
  ADTS,
  AdtsOutputFormat,
  BufferTarget,
  Conversion,
  ConversionOptions,
  FLAC,
  FlacOutputFormat,
  HLS,
  Input,
  InputFormat,
  InputTrack,
  MATROSKA,
  MkvOutputFormat,
  MovOutputFormat,
  MP3,
  Mp3OutputFormat,
  MP4,
  Mp4OutputFormat,
  MPEG_TS,
  MpegTsOutputFormat,
  OGG,
  OggOutputFormat,
  Output,
  OutputFormat,
  QTFF,
  Target,
  WAVE,
  WavOutputFormat,
  WEBM,
  WebMOutputFormat
} from 'mediabunny'

export const supportedAudioOutputFormats = {
  adts: () => new AdtsOutputFormat(),
  flac: () => new FlacOutputFormat(),
  mp3: () => new Mp3OutputFormat(),
  ogg: () => new OggOutputFormat(),
  wav: () => new WavOutputFormat()
} as const

export const supportedVideoOutputFormats = {
  mp4: () => new Mp4OutputFormat(),
  mov: () => new MovOutputFormat(),
  mkv: () => new MkvOutputFormat(),
  webm: () => new WebMOutputFormat(),
  ts: () => new MpegTsOutputFormat()
} as const

export const supportedOutputFormats = {
  ...supportedVideoOutputFormats,
  ...supportedAudioOutputFormats
}

export const outputFormatForInputFormat = {
  mp4: {
    input: MP4,
    output: () => new Mp4OutputFormat()
  },
  mov: {
    input: QTFF,
    output: () => new MovOutputFormat()
  },
  mkv: {
    input: MATROSKA,
    output: () => new MkvOutputFormat()
  },
  webm: {
    input: WEBM,
    output: () => new WebMOutputFormat()
  },
  mp3: {
    input: MP3,
    output: () => new Mp3OutputFormat()
  },
  wav: {
    input: WAVE,
    output: () => new WavOutputFormat()
  },
  ogg: {
    input: OGG,
    output: () => new OggOutputFormat()
  },
  adts: {
    input: ADTS,
    output: () => new AdtsOutputFormat()
  },
  flac: {
    input: FLAC,
    output: () => new FlacOutputFormat()
  },
  ts: {
    input: MPEG_TS,
    output: () => new MpegTsOutputFormat()
  },
  hls: {
    input: HLS,
    output: () => new MpegTsOutputFormat()
  }
} as const

export const SUPPORTED_AUDIO_OUTPUT_FORMATS: SupportedAudioOutputFormat[] = [
  'adts',
  'flac',
  'mp3',
  'ogg',
  'wav'
]

export const SUPPORTED_VIDEO_OUTPUT_FORMATS: SupportedVideoOutputFormat[] = [
  'mkv',
  'mov',
  'mp4',
  'ts',
  'webm'
]

export const SUPPORTED_OUTPUT_FORMATS: SupportedOutputFormat[] = [
  ...SUPPORTED_VIDEO_OUTPUT_FORMATS,
  ...SUPPORTED_AUDIO_OUTPUT_FORMATS
]

export function getOutputFormatForInputFormat(inputFormat: InputFormat): OutputFormat {
  const mappedFormat = Object.values(outputFormatForInputFormat).find(
    ({ input }) => inputFormat === input
  )

  if (!mappedFormat) {
    throw new Error(`Unsupported output format: ${inputFormat.name}`)
  }

  return mappedFormat.output()
}

export async function getInputData(input: Input): Promise<InputMediaData> {
  let data = {}

  const [audioTracks, duration, format, metadata, mimeType, size] = await Promise.all([
    input.getAudioTracks(),
    input.getDurationFromMetadata(),
    input.getFormat(),
    input.getMetadataTags(),
    input.getMimeType(),
    input.source.getSizeOrNull()
  ])

  const computedDuration = await input.computeDuration()

  data = {
    audioTracks: audioTracks.length,
    duration,
    computedDuration,
    format: { name: format.name, mimeType: format.mimeType },
    metadata,
    mimeType,
    size
  }

  const tracksData = await getTracksData(input)

  data = { ...data, tracksData }

  return data as InputMediaData
}
export async function getTrackData(track: InputTrack) {
  const codec = await track.getCodec()
  const codecParamString = await track.getCodecParameterString()
  const disposition = await track.getDisposition()
  const duration = await track.getDurationFromMetadata()
  const lang = await track.getLanguageCode()
  const isAudio = track.isAudioTrack()
  const isVideo = track.isVideoTrack()
  const stats = await track.computePacketStats(100)
  const averageBitrate = stats.averageBitrate
  let trackData = {
    id: track.id,
    type: track.type,
    averageBitrate,
    codec,
    codecParamString,
    disposition,
    duration,
    lang,
    isAudio,
    isVideo
  }

  if (track.isVideoTrack()) {
    const codedHeight = await track.getCodedHeight()
    const codedWidth = await track.getCodedWidth()
    const colorSpace = await track.getColorSpace()
    const displayHeight = await track.getDisplayHeight()
    const displayWidth = await track.getDisplayWidth()
    const rotation = await track.getRotation()
    const frameRate = stats.averagePacketRate
    const videoData = {
      codedHeight,
      codedWidth,
      colorSpace,
      displayHeight,
      displayWidth,
      rotation,
      frameRate,
      averageBitrate
    }

    trackData = { ...trackData, ...videoData }
  } else if (track.isAudioTrack()) {
    const sampleRate = await track.getSampleRate()
    const channels = await track.getNumberOfChannels()
    const audioData = { sampleRate, channels }

    trackData = { ...trackData, ...audioData }
  }

  return trackData
}

export async function getTracksData(input: Input) {
  const tracks = await input.getTracks()

  const tracksData = []

  for (const track of tracks) {
    const trackData = await getTrackData(track)
    tracksData.push(trackData)
  }

  return tracksData
}

export async function convertFormat(
  input: Input,
  format: SupportedOutputFormat,
  onProgress: (progress: number) => unknown,
  target?: Target
) {
  const output = new Output({
    format: supportedOutputFormats[format](),
    target: target ?? new BufferTarget()
  })

  const conversion = await Conversion.init({
    input,
    output
  })

  if (!conversion.isValid) {
    throw new ConversionError(conversion.discardedTracks)
  }

  conversion.onProgress = onProgress
  await conversion.execute()

  return conversion
}

export async function trim(
  input: Input,
  onProgress: (progress: number, processedTime: number) => unknown,
  trim: {
    start: number
    end: number
  },
  target?: Target
) {
  const inputFormat = await input.getFormat()

  const output = new Output({
    format: getOutputFormatForInputFormat(inputFormat),
    target: target ?? new BufferTarget()
  })

  const conversionOptions: ConversionOptions = {
    input,
    output
  }

  if (trim) {
    conversionOptions.trim = trim
  }

  const conversion = await Conversion.init(conversionOptions)

  if (!conversion.isValid) {
    throw new ConversionError(conversion.discardedTracks)
  }

  conversion.onProgress = onProgress
  await conversion.execute()

  return conversion
}

export async function removeAudio(
  input: Input,
  onProgress: (progress: number, processedTime: number) => unknown,
  target?: Target
) {
  const inputFormat = await input.getFormat()

  const output = new Output({
    format: getOutputFormatForInputFormat(inputFormat),
    target: target ?? new BufferTarget()
  })

  const conversionOptions: ConversionOptions = {
    input,
    output,
    audio: {
      discard: true
    }
  }

  const conversion = await Conversion.init(conversionOptions)

  if (!conversion.isValid) {
    throw new ConversionError(conversion.discardedTracks)
  }

  conversion.onProgress = onProgress
  await conversion.execute()

  return conversion
}
