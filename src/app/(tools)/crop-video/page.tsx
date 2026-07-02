'use client'

import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { usePlayerStore } from '@/store/use-player-store'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'

const CropVideo = ({ file, fileData }: ToolPageProps) => {
  const { left, top, width, height } = usePlayerStore()
  const crop = { left, top, width, height }

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleCrop() {
    await convertWithErrorHandler(() => execute({ crop }))
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
      {(file, fileData) => (
        <ToolCentered>
          <CropVideo file={file} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
