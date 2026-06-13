'use client'

import { Button } from './ui/button'
import ProgressBar from './progress-bar'
import { usePathname } from 'next/navigation'
import { tools } from '@/tools'

const ToolCompletion = ({ progress, handleSave }: { progress: number; handleSave: () => void }) => {
  const pathname = usePathname()
  const tool = tools.find((t) => t.path === pathname)!
  const { loading } = tool

  return (
    <>
      <div className="flex justify-center">
        <ProgressBar progress={progress} description={loading!} />
      </div>
      <div className="flex justify-center">
        <Button disabled={progress < 100} onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  )
}
export default ToolCompletion
