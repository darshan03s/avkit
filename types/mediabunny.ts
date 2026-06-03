import { getTrackData } from '@/utils/mediabunny'

export type InputMediaData = {
  audioTracks: number
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
