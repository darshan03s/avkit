'use client'

import { ToolAction } from '@/components/tool/tool-action'
import { ToolCompletion } from '@/components/tool/tool-completion'
import { ToolContainer } from '@/components/tool/tool-container'
import { ToolMain } from '@/components/tool/tool-main'
import { useConversion } from '@/hooks/use-conversion'
import { useCropStore } from '@/store/use-crop-store'
import { convertWithErrorHandler } from '@/utils'

const CropVideo = () => {
  const { left, top, width, height } = useCropStore()
  const crop = { left, top, width, height }

  const { progress, execute, cancel, save } = useConversion()

  async function handleCrop() {
    await convertWithErrorHandler(() => execute({ crop }))
  }

  return (
    <ToolContainer>
      <ToolMain showCropper={true}>
        {crop && (
          <p className="text-xs text-muted-foreground text-center">
            {crop.width} × {crop.height} px &nbsp;·&nbsp; left {crop.left}px, top {crop.top}px
          </p>
        )}
        {progress < 1 && <ToolAction onClick={handleCrop} disabled={!crop} />}
        {progress > 1 && <ToolCompletion progress={progress} handleSave={save} cancel={cancel} />}
      </ToolMain>
    </ToolContainer>
  )
}

export default CropVideo
