'use client'

import ProgressBar from '@/components/progress-bar'
import SelectBox from '@/components/select-box'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { compressVideo } from '@/utils/mediabunny'
import { Hd } from 'lucide-react'
import {
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
  QUALITY_VERY_HIGH,
  QUALITY_VERY_LOW
} from 'mediabunny'
import { useState } from 'react'

const ChangeQuality = ({ file, fileInput, fileData }: ToolPageProps) => {
  const qualityMap = {
    'Very low': QUALITY_VERY_LOW,
    Low: QUALITY_LOW,
    Medium: QUALITY_MEDIUM,
    High: QUALITY_HIGH,
    'Very high': QUALITY_VERY_HIGH
  }
  const [quality, setQuality] = useState<keyof typeof qualityMap>()
  const qualityOptions = Object.keys(qualityMap)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleCompress() {
    if (!quality) return

    await convertWithErrorHandler(() =>
      execute((onProgress) => compressVideo(fileInput, qualityMap[quality], onProgress))
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        <SelectBox
          label="Quality"
          value={quality}
          onValueChange={(v) => setQuality(v as keyof typeof qualityMap)}
          placeholder="Select a quality"
          groupLabel="Quality"
          options={qualityOptions}
        />
        {progress < 1 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-accent-foreground text-center">
              This process will change the bitrate of the video.
            </span>
            <Button onClick={handleCompress} disabled={!quality}>
              <Hd /> Change quality
            </Button>
          </div>
        )}
        {progress > 1 && (
          <>
            <ProgressBar progress={progress} description="Changing quality..." />
            <Button disabled={progress < 100} onClick={handleSave}>
              Save
            </Button>
          </>
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
          <ChangeQuality file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
