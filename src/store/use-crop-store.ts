import { create } from 'zustand'
import { VideoCropRect } from '@/types'

type CropStore = {
  left: number
  top: number
  width: number
  height: number
  setLeft: (left: number) => void
  setTop: (top: number) => void
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  onCropChange: (crop: VideoCropRect) => void
}

export const useCropStore = create<CropStore>((set) => ({
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  setLeft: (left: number) => set({ left }),
  setTop: (top: number) => set({ top }),
  setWidth: (width: number) => set({ width }),
  setHeight: (height: number) => set({ height }),
  onCropChange: (crop: VideoCropRect) =>
    set({ left: crop.left, top: crop.top, width: crop.width, height: crop.height })
}))
