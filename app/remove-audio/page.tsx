'use client'

import Player from '@/components/player'
import ProgressBar from '@/components/progress-bar'
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
    <div className="max-w-6xl mx-auto">
      <div className="space-y-4 flex flex-col items-center">
        <Player data={data} file={file} />
        <span className="text-md font-semibold text-center line-clamp-2">{file.name}</span>
        {progress < 1 && (
          <div className="flex justify-center">
            <Button onClick={handleRemoveAudio}>
              <VolumeOff /> Remove Audio
            </Button>
          </div>
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
  )
}

const Page = () => {
  return (
    <ToolPage description="Upload audio or video">
      {(file) => (
        <div className="flex-1 flex items-center justify-center">
          <RemoveAudio file={file} />
        </div>
      )}
    </ToolPage>
  )
}
export default Page
