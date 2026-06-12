import { IconCrop, IconDisc, IconDiscOff, IconKeyframes } from '@tabler/icons-react'
import { Code, Info, Repeat2, Scissors } from 'lucide-react'

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
  }
] as const
