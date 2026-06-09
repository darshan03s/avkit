import {
  getTrackData,
  supportedAudioOutputFormats,
  supportedOutputFormats,
  supportedVideoOutputFormats
} from '@/utils/mediabunny'
import { Input, InputAudioTrack } from 'mediabunny'

export type InputMediaData = {
  audioTracks: InputAudioTrack[]
  duration: number
  format: {
    name: string
    mimeType: string
  }
  metadata: Metadata
  mimeType: string
  size: number | null
  tracksData: TrackData[]
}

type Metadata = {
  raw: Record<string, unknown>
  title?: string
  artist?: string
  genre?: string
  images?: MetadataImage[]
  comment?: string
  description?: string
}

type MetadataImage = {
  data: Uint8Array
  kind?: string
  mimeType: string
}

export type TrackData = Awaited<ReturnType<typeof getTrackData>>

export type SupportedVideoOutputFormat = keyof typeof supportedVideoOutputFormats

export type SupportedAudioOutputFormat = keyof typeof supportedAudioOutputFormats

export type SupportedOutputFormat = keyof typeof supportedOutputFormats

export type MediaBunnyInput = Input
