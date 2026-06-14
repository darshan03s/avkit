'use client'

import ToolAction from '@/components/tool-action'
import ToolCentered from '@/components/tool-centered'
import ToolCompletion from '@/components/tool-completion'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { usePlayerStore } from '@/store/use-player-store'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { cropVideo } from '@/utils/mediabunny'

const CropVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const { left, top, width, height } = usePlayerStore()
  const crop = { left, top, width, height }

  const { progress, conversion, execute, reset, cancel } = useConversion()

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
        {crop && (
          <p className="text-xs text-muted-foreground">
            {crop.width} × {crop.height} px &nbsp;·&nbsp; left {crop.left}px, top {crop.top}px
          </p>
        )}
        {progress < 1 && <ToolAction onClick={handleCrop} disabled={!crop} />}
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
          <CropVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
