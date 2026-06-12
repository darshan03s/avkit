import {
  getTrackData,
  supportedAudioOutputFormats,
  supportedOutputFormats,
  supportedVideoOutputFormats
} from '@/utils/mediabunny'
import { Input, InputAudioTrack, MetadataTags, Rotation } from 'mediabunny'

export type InputMediaData = {
  audioTracks: InputAudioTrack[]
  duration: number
  format: {
    name: string
    mimeType: string
  }
  metadataTags: MetadataTags
  mimeType: string
  size: number | null
  tracksData: TrackData[]
}

export type TrackData = Awaited<ReturnType<typeof getTrackData>> & {
  codedHeight?: number
  codedWidth?: number
  colorSpace?: VideoColorSpaceInit
  displayHeight?: number
  displayWidth?: number
  rotation?: Rotation
  frameRate?: number
  sampleRate?: number
  channels?: number
}

export type SupportedVideoOutputFormat = keyof typeof supportedVideoOutputFormats

export type SupportedAudioOutputFormat = keyof typeof supportedAudioOutputFormats

export type SupportedOutputFormat = keyof typeof supportedOutputFormats

export type MediaBunnyInput = Input
