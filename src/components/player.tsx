import { useFile } from '@/store/use-file'
import { usePlayerStore } from '@/store/use-player-store'
import { getFileType } from '@/utils'
import Image from 'next/image'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

const VideoPlayer = ({
  fileUrl,
  posterUrl
}: {
  fileUrl: string
  posterUrl: string | undefined
}) => {
  return (
    <video
      src={fileUrl}
      controls={true}
      poster={posterUrl}
      className="aspect-video w-80 md:w-100 rounded-md outline"
    />
  )
}

const VideoPlayerWithCropper = ({
  fileUrl,
  posterUrl
}: {
  fileUrl: string
  posterUrl: string | undefined
}) => {
  type DisplayCropRect = { x: number; y: number; w: number; h: number }
  type DragHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'move'
  const MIN_SIZE = 30

  const HANDLES: { id: DragHandle; cursor: string; style: React.CSSProperties }[] = [
    {
      id: 'nw',
      cursor: 'nw-resize',
      style: { top: 0, left: 0, transform: 'translate(-50%,-50%)' }
    },
    {
      id: 'n',
      cursor: 'n-resize',
      style: { top: 0, left: '50%', transform: 'translate(-50%,-50%)' }
    },
    {
      id: 'ne',
      cursor: 'ne-resize',
      style: { top: 0, right: 0, transform: 'translate(50%,-50%)' }
    },
    {
      id: 'e',
      cursor: 'e-resize',
      style: { top: '50%', right: 0, transform: 'translate(50%,-50%)' }
    },
    {
      id: 'se',
      cursor: 'se-resize',
      style: { bottom: 0, right: 0, transform: 'translate(50%,50%)' }
    },
    {
      id: 's',
      cursor: 's-resize',
      style: { bottom: 0, left: '50%', transform: 'translate(-50%,50%)' }
    },
    {
      id: 'sw',
      cursor: 'sw-resize',
      style: { bottom: 0, left: 0, transform: 'translate(-50%,50%)' }
    },
    {
      id: 'w',
      cursor: 'w-resize',
      style: { top: '50%', left: 0, transform: 'translate(-50%,-50%)' }
    }
  ]

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [crop, setCrop] = useState<DisplayCropRect>({ x: 60, y: 40, w: 300, h: 180 })
  const [videoNaturalSize, setVideoNaturalSize] = useState({ w: 0, h: 0 })
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const { onCropChange } = usePlayerStore()

  const handleVideoLoad = () => {
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
  }

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

  const startDrag = useCallback(
    (handle: DragHandle, e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
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

  return (
    <div ref={containerRef} className="relative">
      <video
        ref={videoRef}
        src={fileUrl}
        controls={true}
        poster={posterUrl}
        className="w-80 md:w-140 outline"
        onLoadedData={handleVideoLoad}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute border-2 border-white"
          style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
        />

        {[1, 2].map((n) => (
          <div
            key={`v${n}`}
            className="absolute bg-white/30"
            style={{ left: crop.x + (crop.w / 3) * n - 0.5, top: crop.y, width: 1, height: crop.h }}
          />
        ))}
        {[1, 2].map((n) => (
          <div
            key={`h${n}`}
            className="absolute bg-white/30"
            style={{ left: crop.x, top: crop.y + (crop.h / 3) * n - 0.5, width: crop.w, height: 1 }}
          />
        ))}
      </div>

      <div
        className="absolute cursor-move touch-none"
        style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
        onMouseDown={(e) => startDrag('move', e)}
        onTouchStart={(e) => startDrag('move', e)}
      >
        {HANDLES.map(({ id, cursor, style }) => (
          <div
            key={id}
            className="absolute w-4 h-4 bg-white rounded-sm shadow-md border border-black/30 touch-none"
            style={{ ...style, cursor }}
            onMouseDown={(e) => startDrag(id, e)}
            onTouchStart={(e) => startDrag(id, e)}
          />
        ))}
      </div>
    </div>
  )
}

const AudioPlayer = ({
  fileUrl,
  posterUrl
}: {
  fileUrl: string
  posterUrl: string | undefined
}) => {
  return (
    <>
      {posterUrl ? (
        <div className="flex flex-col items-center w-80 md:w-100">
          <Image
            src={posterUrl}
            alt="poster"
            width={480}
            height={300}
            className="rounded-md aspect-video"
          />
          <audio src={fileUrl} controls className="w-full h-10" />
        </div>
      ) : (
        <audio src={fileUrl} controls />
      )}
    </>
  )
}

const Player = ({ showCropper = false }: { showCropper?: boolean }) => {
  const file = useFile((s) => s.file!)
  const fileData = useFile((s) => s.fileData!)

  const fileUrl = URL.createObjectURL(file)
  const fileType = getFileType(file)

  const image = fileData.metadataTags.images?.[0]

  const posterUrl = image
    ? URL.createObjectURL(
        new Blob([new Uint8Array(image.data)], {
          type: image.mimeType
        })
      )
    : undefined

  return (
    <div className="player flex items-center justify-center">
      {fileType === 'video' ? (
        showCropper ? (
          <VideoPlayerWithCropper fileUrl={fileUrl} posterUrl={posterUrl} />
        ) : (
          <VideoPlayer fileUrl={fileUrl} posterUrl={posterUrl} />
        )
      ) : (
        <AudioPlayer fileUrl={fileUrl} posterUrl={posterUrl} />
      )}
    </div>
  )
}

export default memo(Player)
