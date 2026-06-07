'use client'

import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { useConversion } from '@/hooks/use-conversion'
import { useInput } from '@/hooks/use-input'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { removeAudio } from '@/utils/mediabunny'
import { VolumeOff } from 'lucide-react'

const RemoveAudio = ({ file }: { file: File }) => {
  const input = useInput(file)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleRemoveAudio() {
    await convertWithErrorHandler(() => execute((onProgress) => removeAudio(input, onProgress)))
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} input={input}>
        {() => (
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            {progress < 1 && (
              <Button onClick={handleRemoveAudio}>
                <VolumeOff /> Remove Audio
              </Button>
            )}
            {progress > 1 && (
              <>
                <ProgressBar progress={progress} description="Removing audio..." />
                <Button disabled={progress < 100} onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </div>
        )}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import video">
      {(file) => (
        <ToolCentered>
          <RemoveAudio file={file} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}
export default Page
