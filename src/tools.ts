import { IconCrop, IconDisc, IconDiscOff, IconKeyframes, IconResize } from '@tabler/icons-react'
import { Code, FileText, Hd, Info, LucideIcon, Repeat2, RotateCw, Scissors } from 'lucide-react'

type Tool = {
  name: string
  icon: LucideIcon
  description: string
  inputDescription: string
  note?: string
  loading?: string
  accept: 'audio' | 'video' | 'both'
}

export const tools: Record<string, Tool> = {
  '/inspect': {
    name: 'Inspect',
    icon: Info,
    description: 'Inspect audio/video',
    inputDescription: 'Import audio/video file',
    accept: 'both'
  },
  '/convert-format': {
    name: 'Convert format',
    icon: Repeat2,
    description: 'Convert audio/video format',
    inputDescription: 'Import audio/video file',
    loading: 'Converting...',
    accept: 'both'
  },
  '/trim': {
    name: 'Trim',
    icon: Scissors,
    description: 'Trim audio/video',
    inputDescription: 'Import audio/video file',
    loading: 'Trimming...',
    accept: 'both'
  },
  '/extract-track': {
    name: 'Extract track',
    icon: IconDisc,
    description: 'Extract specific track from video',
    inputDescription: 'Import video file',
    loading: 'Extracting...',
    accept: 'video'
  },
  '/discard-track': {
    name: 'Discard track',
    icon: IconDiscOff,
    description: 'Discard tracks from video',
    inputDescription: 'Import video file',
    loading: 'Discarding...',
    accept: 'video'
  },
  '/change-codec': {
    name: 'Change codec',
    icon: Code,
    description: 'Change codec of audio/video',
    inputDescription: 'Import audio/video file',
    note: 'This process is dependent on your browser support for the codec.',
    loading: 'Changing codec...',
    accept: 'both'
  },
  '/change-frame-rate': {
    name: 'Change frame rate',
    icon: IconKeyframes,
    description: 'Change frame rate of video',
    inputDescription: 'Import video file',
    loading: 'Changing frame rate...',
    accept: 'video'
  },
  '/crop-video': {
    name: 'Crop video',
    icon: IconCrop,
    description: 'Crop video',
    inputDescription: 'Import video file',
    loading: 'Cropping...',
    accept: 'video'
  },
  '/resize-video': {
    name: 'Resize video',
    icon: IconResize,
    description: 'Resize video',
    inputDescription: 'Import video file',
    loading: 'Resizing...',
    accept: 'video'
  },
  '/change-quality': {
    name: 'Change quality',
    icon: Hd,
    description: 'Change quality of video',
    inputDescription: 'Import video file',
    loading: 'Changing quality...',
    accept: 'video',
    note: 'This process will change the bitrate of the video.'
  },
  '/rotate-video': {
    name: 'Rotate video',
    icon: RotateCw,
    description: 'Rotate video',
    inputDescription: 'Import video file',
    loading: 'Rotating...',
    accept: 'video'
  },
  '/remove-metadata': {
    name: 'Remove metadata',
    icon: FileText,
    description: 'Remove metadata from audio/video',
    inputDescription: 'Import audio/video file',
    loading: 'Removing metadata...',
    accept: 'both'
  }
}
