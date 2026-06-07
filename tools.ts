import { Info, Repeat2, Scissors, VolumeOff } from 'lucide-react'

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
    description: 'Remove all audio tracks from video'
  }
] as const
