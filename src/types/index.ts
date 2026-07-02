import { InputMediaData } from './mediabunny'

export type ToolPageProps = {
  file: File
  fileData: InputMediaData
}

export type VideoCropRect = { left: number; top: number; width: number; height: number }
