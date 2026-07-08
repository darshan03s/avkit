import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getFileType } from '@/utils'
import { useFile } from '@/store/use-file'
import { useCropStore } from '@/store/use-crop-store'
import { DisplayCropRect, DragHandle } from '@/types'

type PlaybackState = {
  progress: number
  duration: number
  currentTime: number
  isPlaying: boolean
  isMuted: boolean
}

type PlayerStaticContextType = {
  containerRef: React.RefObject<HTMLDivElement | null>
  videoRef: React.RefObject<HTMLVideoElement | null>
  posterUrl?: string
  videoUrl?: string
  showHTMLControls?: boolean
  showFileName?: boolean
  showCropper?: boolean
  setIsPlaying: (isPlaying: boolean) => void
  setIsMuted: (isMuted: boolean) => void
  sliderOnValueChange: (value: number[]) => void
  playPause: () => void
  handleMute: () => void
  handleMaximize: () => void
  handleCapture: () => void
  handleRewind: () => void
  handleFastForward: () => void
  type: 'video' | 'audio' | 'unknown'
  crop: DisplayCropRect
  initializeCropper: () => void
  startDrag: (handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => void
}

const PlayerStaticContext = createContext<PlayerStaticContextType | undefined>(undefined)

const PlayerPlaybackContext = createContext<PlaybackState | undefined>(undefined)

export const PlayerProvider = ({
  children,
  showHTMLControls,
  showFileName,
  showCropper
}: {
  children: React.ReactNode
  showHTMLControls: boolean | undefined
  showFileName: boolean | undefined
  showCropper: boolean | undefined
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const file = useFile((s) => s.file!)
  const fileData = useFile((s) => s.fileData!)
  const [playback, setPlayback] = useState<PlaybackState>({
    progress: 0,
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    isMuted: false
  })
  const [videoUrl, setVideoUrl] = useState<string>()
  const [posterUrl, setPosterUrl] = useState<string>()
  const [crop, setCrop] = useState<DisplayCropRect>({ x: 60, y: 40, w: 300, h: 180 })
  const [videoNaturalSize, setVideoNaturalSize] = useState({ w: 0, h: 0 })
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const { onCropChange } = useCropStore()
  const type = getFileType(file)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  const image = fileData?.metadataTags.images?.[0]

  useEffect(() => {
    if (!image) {
      setPosterUrl(undefined)
      return
    }

    const url = URL.createObjectURL(
      new Blob([new Uint8Array(image.data)], {
        type: image.mimeType
      })
    )

    setPosterUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [image])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const syncDuration = () => {
      if (Number.isFinite(video.duration)) {
        setPlayback((prev) => ({ ...prev, duration: video.duration }))
      }
    }
    const handleTimeUpdate = () => {
      setPlayback((prev) => ({
        ...prev,
        currentTime: video.currentTime,
        progress: Number.isFinite(video.duration)
          ? (video.currentTime / video.duration) * 100
          : prev.progress
      }))
    }
    syncDuration()
    video.addEventListener('loadedmetadata', syncDuration)
    video.addEventListener('durationchange', syncDuration)
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('loadedmetadata', syncDuration)
      video.removeEventListener('durationchange', syncDuration)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [fileData])

  useEffect(() => {
    if (!onCropChange || !videoNaturalSize.w || !containerSize.w) return
    const scaleX = videoNaturalSize.w / containerSize.w
    const scaleY = videoNaturalSize.h / containerSize.h
    onCropChange({
      left: Math.round(crop.x * scaleX),
      top: Math.round(crop.y * scaleY),
      width: Math.round(crop.w * scaleX),
      height: Math.round(crop.h * scaleY)
    })
  }, [crop, videoNaturalSize, containerSize, onCropChange])

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setPlayback((prev) => ({ ...prev, isPlaying }))
  }, [])

  const setIsMuted = useCallback((isMuted: boolean) => {
    setPlayback((prev) => ({ ...prev, isMuted }))
  }, [])

  const sliderOnValueChange = useCallback((val: number[]) => {
    setPlayback((prev) => ({ ...prev, progress: val[0] }))
    const video = videoRef.current
    if (!video) return
    video.currentTime = (val[0] / 100) * video.duration
  }, [])

  const playPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
    } else {
      video.pause()
    }
  }, [])

  const handleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setPlayback((prev) => ({ ...prev, isMuted: video.muted }))
  }, [])

  const handleMaximize = useCallback(() => {
    videoRef.current?.requestFullscreen()
  }, [])

  const handleRewind = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime -= 10
  }, [])

  const handleFastForward = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime += 10
  }, [])

  const handleCapture = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const image = canvas.toDataURL()
    const link = document.createElement('a')
    link.href = image
    link.download = 'frame_' + file.name.split('.').slice(0, -1).join('.') + '.png'
    link.target = '_blank'
    link.click()
    link.remove()
  }, [file.name])

  const initializeCropper = useCallback(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return
    const { width, height } = container.getBoundingClientRect()
    setVideoNaturalSize({ w: video.videoWidth, h: video.videoHeight })
    setContainerSize({ w: width, h: height })
    const pad = 0.15
    setCrop({
      x: Math.round(width * pad),
      y: Math.round(height * pad),
      w: Math.round(width * (1 - pad * 2)),
      h: Math.round(height * (1 - pad * 2))
    })
  }, [])

  const startDrag = useCallback(
    (handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const MIN_SIZE = 30
      const container = containerRef.current
      if (!container) return

      const getPoint = (ev: MouseEvent | TouchEvent) => {
        if ('touches' in ev) {
          const t = ev.touches[0] ?? ev.changedTouches[0]
          return { clientX: t.clientX, clientY: t.clientY }
        }
        return { clientX: ev.clientX, clientY: ev.clientY }
      }

      const origin =
        'touches' in e
          ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
          : { clientX: e.clientX, clientY: e.clientY }

      const startX = origin.clientX
      const startY = origin.clientY
      const { x, y, w, h } = crop
      const { width: cw, height: ch } = container.getBoundingClientRect()

      const onMove = (ev: MouseEvent | TouchEvent) => {
        const { clientX, clientY } = getPoint(ev)
        const dx = clientX - startX
        const dy = clientY - startY

        if (handle === 'move') {
          setCrop({
            x: Math.max(0, Math.min(x + dx, cw - w)),
            y: Math.max(0, Math.min(y + dy, ch - h)),
            w,
            h
          })
          return
        }

        let left = x
        let top = y
        let right = x + w
        let bottom = y + h

        if (handle.includes('w')) left = x + dx
        if (handle.includes('e')) right = x + w + dx
        if (handle.includes('n')) top = y + dy
        if (handle.includes('s')) bottom = y + h + dy

        if (right - left < MIN_SIZE) {
          if (handle.includes('w')) left = right - MIN_SIZE
          else right = left + MIN_SIZE
        }
        if (bottom - top < MIN_SIZE) {
          if (handle.includes('n')) top = bottom - MIN_SIZE
          else bottom = top + MIN_SIZE
        }

        left = Math.max(0, left)
        top = Math.max(0, top)
        right = Math.min(cw, right)
        bottom = Math.min(ch, bottom)

        setCrop({ x: left, y: top, w: right - left, h: bottom - top })
      }

      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
        window.removeEventListener('touchmove', onMove)
        window.removeEventListener('touchend', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove, { passive: false })
      window.addEventListener('touchend', onUp)
    },
    [crop]
  )

  const staticValue = useMemo<PlayerStaticContextType>(() => {
    return {
      file,
      fileData,
      containerRef,
      videoRef,
      showHTMLControls,
      showFileName,
      showCropper,
      posterUrl,
      videoUrl,
      setIsPlaying,
      setIsMuted,
      sliderOnValueChange,
      playPause,
      handleMute,
      handleMaximize,
      handleCapture,
      handleRewind,
      handleFastForward,
      type,
      crop,
      initializeCropper,
      startDrag
    }
  }, [
    file,
    fileData,
    showHTMLControls,
    showFileName,
    showCropper,
    posterUrl,
    videoUrl,
    setIsPlaying,
    setIsMuted,
    sliderOnValueChange,
    playPause,
    handleMute,
    handleMaximize,
    handleCapture,
    handleRewind,
    handleFastForward,
    type,
    crop,
    initializeCropper,
    startDrag
  ])

  return (
    <PlayerStaticContext.Provider value={staticValue}>
      <PlayerPlaybackContext.Provider value={playback}>{children}</PlayerPlaybackContext.Provider>
    </PlayerStaticContext.Provider>
  )
}

export const usePlayerStaticContext = () => {
  const context = useContext(PlayerStaticContext)
  if (!context) {
    throw new Error('usePlayerStaticContext must be used within a PlayerProvider')
  }
  return context
}

export const usePlayerPlaybackContext = () => {
  const context = useContext(PlayerPlaybackContext)
  if (!context) {
    throw new Error('usePlayerPlaybackContext must be used within a PlayerProvider')
  }
  return context
}
