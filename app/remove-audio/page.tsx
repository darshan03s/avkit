'use client'

import FileName from '@/components/file-name'
import Player from '@/components/player'
import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { useConversion } from '@/hooks/use-conversion'
import { useInput } from '@/hooks/use-input'
import { InputMediaData } from '@/types/mediabunny'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { getInputData, removeAudio } from '@/utils/mediabunny'
import { VolumeOff } from 'lucide-react'
import { useEffect, useState } from 'react'

const RemoveAudio = ({ file }: { file: File }) => {
  const input = useInput(file)
  const [data, setData] = useState<InputMediaData | null>(null)

  useEffect(() => {
    async function getData() {
      const d = await getInputData(input)
      setData(d)
    }

    getData()
  }, [input])

  const { progress, conversion, execute, reset } = useConversion()

  async function handleRemoveAudio() {
    await convertWithErrorHandler(() => execute((onProgress) => removeAudio(input, onProgress)))
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  if (!data) return null

  return (
    <ToolContainer>
      <div className="space-y-4">
        <Player data={data} file={file} />
        <FileName name={file.name} />
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
      </div>
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
