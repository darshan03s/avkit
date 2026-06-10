import { IconKeyframes } from '@tabler/icons-react'
import { Code, Disc, Info, Repeat2, Scissors, VolumeOff } from 'lucide-react'

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
    name: 'Remove audio',
    path: '/remove-audio',
    icon: VolumeOff,
    description: 'Remove audio tracks from video'
  },
  {
    name: 'Extract track',
    path: '/extract-track',
    icon: Disc,
    description: 'Extract specific track from video'
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
  }
] as const
