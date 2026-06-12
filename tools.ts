import { IconCrop, IconDisc, IconDiscOff, IconKeyframes, IconResize } from '@tabler/icons-react'
import { Code, Hd, Info, Repeat2, RotateCw, Scissors } from 'lucide-react'

export const tools = [
  {
    name: 'View metadata',
    path: '/view-metadata',
    icon: Info,
    description: 'View metadata of audio/video'
  },
  {
    name: 'Convert format',
    path: '/convert-format',
    icon: Repeat2,
    description: 'Convert audio/video format'
  },
  {
    name: 'Trim',
    path: '/trim',
    icon: Scissors,
    description: 'Trim audio/video'
  },
  {
    name: 'Extract track',
    path: '/extract-track',
    icon: IconDisc,
    description: 'Extract specific track from video'
  },
  {
    name: 'Discard track',
    path: '/discard-track',
    icon: IconDiscOff,
    description: 'Discard tracks from video'
  },
  {
    name: 'Change codec',
    path: '/change-codec',
    icon: Code,
    description: 'Change codec of audio/video'
  },
  {
    name: 'Change frame rate',
    path: '/change-frame-rate',
    icon: IconKeyframes,
    description: 'Change frame rate of video'
  },
  {
    name: 'Crop video',
    path: '/crop-video',
    icon: IconCrop,
    description: 'Crop video'
  },
  {
    name: 'Resize video',
    path: '/resize-video',
    icon: IconResize,
    description: 'Resize video'
  },
  {
    name: 'Change quality',
    path: '/change-quality',
    icon: Hd,
    description: 'Change quality of video'
  },
  {
    name: 'Rotate video',
    path: '/rotate-video',
    icon: RotateCw,
    description: 'Rotate video'
  }
] as const
