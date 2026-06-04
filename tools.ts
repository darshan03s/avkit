import { Info, Repeat2, Scissors } from 'lucide-react'

export const tools = [
  {
    name: 'View metadata',
    path: '/view-metadata',
    icon: Info,
    description: 'Upload audio or video to see metadata'
  },
  {
    name: 'Convert format',
    path: '/convert-format',
    icon: Repeat2,
    description: 'Upload audio or video file to convert'
  },
  {
    name: 'Trim',
    path: '/trim',
    icon: Scissors,
    description: 'Upload audio or video file to trim'
  }
] as const
