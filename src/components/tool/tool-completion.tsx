'use client'

import { Button } from '../ui/button'
import ProgressBar from '../progress-bar'
import { usePathname } from 'next/navigation'
import { tools } from '@/tools'
import { X } from 'lucide-react'
import { IconFileDownload } from '@tabler/icons-react'

const ToolCompletion = ({
  progress,
  handleSave,
  cancel
}: {
  progress: number
  handleSave: () => void
  cancel?: () => void
}) => {
  const pathname = usePathname()
  const tool = tools.find((t) => t.path === pathname)!
  const { loading } = tool

  return (
    <>
      <div className="flex justify-center">
        <ProgressBar progress={progress} description={loading!} />
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button disabled={progress < 100} onClick={() => handleSave()} className="font-mono">
          <IconFileDownload />
          Save
        </Button>
        {progress < 100 && (
          <Button variant="destructive" onClick={cancel} className="font-mono">
            <X /> Cancel
          </Button>
        )}
      </div>
    </>
  )
}
export default ToolCompletion
