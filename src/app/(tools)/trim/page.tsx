'use client'

import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertToSeconds, convertWithErrorHandler, isValidDuration } from '@/utils'
import { useState } from 'react'
import { toast } from 'sonner'

const Trim = ({ file, fileData }: ToolPageProps) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const { progress, execute, cancel, save } = useConversion()

  async function handleTrim() {
    if (!isValidDuration(startTime) && !isValidDuration(endTime)) return

    const start = convertToSeconds(startTime)
    const end = convertToSeconds(endTime)

    if (start === end) {
      toast.error('Start and end cannot be the same')
      return
    }

    if (start > end) {
      toast.error('Start cannot be more than end')
      return
    }

    if (start > fileData.duration || end > fileData.duration) {
      toast.error('Start or end cannot be more than media duration')
      return
    }

    await convertWithErrorHandler(() => execute({ trim: { start, end } }))
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        <div className="space-y-2">
          <Label>Start</Label>
          <Input
            className="placeholder:text-xs md:text-sm"
            placeholder="HH:MM:SS"
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>End</Label>
          <Input
            className="placeholder:text-xs md:text-sm"
            placeholder="HH:MM:SS"
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        {progress < 1 && <ToolAction onClick={handleTrim} disabled={!startTime || !endTime} />}
        {progress > 1 && <ToolCompletion progress={progress} handleSave={save} cancel={cancel} />}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import audio or video">
      {(file, fileData) => (
        <ToolCentered>
          <Trim file={file} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
