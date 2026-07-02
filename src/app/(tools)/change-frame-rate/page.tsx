'use client'

import ShowTracks from '@/components/show-tracks'
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
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { useState } from 'react'

const ChangeFrameRate = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [frameRate, setFrameRate] = useState<string>('1')

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleChangeFrameRate() {
    if (!frameRate) return

    await convertWithErrorHandler(() => execute(fileInput, { frameRate }))
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        <ShowTracks data={fileData} onlyVideo={true} />
        <div className="space-y-2">
          <Label>Frame rate (fps)</Label>
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
        {progress < 1 && <ToolAction onClick={handleChangeFrameRate} disabled={!frameRate} />}
        {progress > 1 && (
          <ToolCompletion progress={progress} handleSave={handleSave} cancel={cancel} />
        )}
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
