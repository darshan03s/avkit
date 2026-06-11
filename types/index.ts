import { InputMediaData, MediaBunnyInput } from './mediabunny'

export type ToolPageProps = {
  file: File
  fileInput: MediaBunnyInput
  fileData: InputMediaData
}

export type VideoCropRect = { left: number; top: number; width: number; height: number }
