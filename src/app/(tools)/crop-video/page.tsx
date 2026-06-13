'use client'

import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { useConversion } from '@/hooks/use-conversion'
import { usePlayerStore } from '@/store/use-player-store'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { cropVideo } from '@/utils/mediabunny'
import { IconCrop } from '@tabler/icons-react'

const CropVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const { progress, conversion, execute, reset } = useConversion()
  const { left, top, width, height } = usePlayerStore()
  const crop = { left, top, width, height }

  async function handleCrop() {
    await convertWithErrorHandler(() =>
      execute((onProgress) => cropVideo(fileInput, crop, onProgress))
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData} showCropper={true}>
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {crop && (
            <p className="text-xs text-muted-foreground">
              {crop.width} × {crop.height} px &nbsp;·&nbsp; left {crop.left}px, top {crop.top}px
            </p>
          )}
          {progress < 1 && (
            <Button onClick={handleCrop} disabled={!crop}>
              <IconCrop /> Crop video
            </Button>
          )}
          {progress > 1 && (
            <>
              <ProgressBar progress={progress} description="Cropping video..." />
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
          <CropVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
