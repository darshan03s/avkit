'use client'

import ProgressBar from '@/components/progress-bar'
import ShowTracks from '@/components/show-tracks'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { changeFrameRate } from '@/utils/mediabunny'
import { IconKeyframes } from '@tabler/icons-react'
import { useState } from 'react'

const ChangeFrameRate = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [frameRate, setFrameRate] = useState<string>('1')

  const { progress, conversion, execute, reset } = useConversion()

  async function handleChangeFrameRate() {
    if (!frameRate) return

    await convertWithErrorHandler(() =>
      execute((onProgress) => changeFrameRate(fileInput, frameRate, onProgress))
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          <ShowTracks data={fileData} onlyVideo={true} />
          <div className="space-y-2">
            <Label className="text-xs text-accent-foreground">Frame rate (fps)</Label>
            <Input
              min="1"
              max="240"
              step="1"
              type="number"
              placeholder="Frame rate"
              value={frameRate}
              onChange={(e) => setFrameRate(e.target.value)}
            />
          </div>
          {progress < 1 && (
            <Button onClick={handleChangeFrameRate} disabled={!frameRate}>
              <IconKeyframes /> Change frame rate
            </Button>
          )}
          {progress > 1 && (
            <>
              <ProgressBar progress={progress} description="Changing frame rate..." />
              <Button disabled={progress < 100} onClick={handleSave}>
                Save
              </Button>
            </>
          )}
        </div>
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import video" acceptAudio={false}>
      {(file, fileInput, fileData) => (
        <ToolCentered>
          <ChangeFrameRate file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
