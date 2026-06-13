import { IconCrop, IconDisc, IconDiscOff, IconKeyframes, IconResize } from '@tabler/icons-react'
import { Code, FileText, Hd, Info, LucideIcon, Repeat2, RotateCw, Scissors } from 'lucide-react'

type Tool = {
  name: string
  path: string
  icon: LucideIcon
  description: string
  note?: string
  loading?: string
}

export const tools: Tool[] = [
  {
    name: 'Inspect',
    path: '/inspect',
    icon: Info,
    description: 'Inspect audio/video'
  },
  {
    name: 'Convert format',
    path: '/convert-format',
    icon: Repeat2,
    description: 'Convert audio/video format',
    loading: 'Converting...'
  },
  {
    name: 'Trim',
    path: '/trim',
    icon: Scissors,
    description: 'Trim audio/video',
    loading: 'Trimming...'
  },
  {
    name: 'Extract track',
    path: '/extract-track',
    icon: IconDisc,
    description: 'Extract specific track from video',
    loading: 'Extracting...'
  },
  {
    name: 'Discard track',
    path: '/discard-track',
    icon: IconDiscOff,
    description: 'Discard tracks from video',
    loading: 'Discarding...'
  },
  {
    name: 'Change codec',
    path: '/change-codec',
    icon: Code,
    description: 'Change codec of audio/video',
    note: 'This process is dependent on your browser support for the codec.',
    loading: 'Changing codec...'
  },
  {
    name: 'Change frame rate',
    path: '/change-frame-rate',
    icon: IconKeyframes,
    description: 'Change frame rate of video',
    loading: 'Changing frame rate...'
  },
  {
    name: 'Crop video',
    path: '/crop-video',
    icon: IconCrop,
    description: 'Crop video',
    loading: 'Cropping...'
  },
  {
    name: 'Resize video',
    path: '/resize-video',
    icon: IconResize,
    description: 'Resize video',
    loading: 'Resizing...'
  },
  {
    name: 'Change quality',
    path: '/change-quality',
    icon: Hd,
    description: 'Change quality of video',
    loading: 'Changing quality...',
    note: 'This process will change the bitrate of the video.'
  },
  {
    name: 'Rotate video',
    path: '/rotate-video',
    icon: RotateCw,
    description: 'Rotate video',
    loading: 'Rotating...'
  },
  {
    name: 'Remove metadata',
    path: '/remove-metadata',
    icon: FileText,
    description: 'Remove metadata from audio/video',
    loading: 'Removing metadata...'
  }
] as const
