import { InputMediaData } from '@/types/mediabunny'
import { Input } from 'mediabunny'
import { create } from 'zustand'

type FileState = {
  file: File | null
  setFile: (file: File | null) => void
  fileInput: Input | null
  setFileInput: (fileInput: Input | null) => void
  fileData: InputMediaData | null
  setFileData: (fileData: InputMediaData | null) => void
  reset: () => void
}

export const useFile = create<FileState>((set) => ({
  file: null,
  setFile: (file: File | null) => set({ file }),
  fileInput: null,
  setFileInput: (fileInput: Input | null) => set({ fileInput }),
  fileData: null,
  setFileData: (fileData: InputMediaData | null) => set({ fileData }),
  reset: () => set({ file: null, fileInput: null, fileData: null })
}))
