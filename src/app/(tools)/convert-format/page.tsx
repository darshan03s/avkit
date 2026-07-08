'use client'

import { useState } from 'react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { convertWithErrorHandler, getFileType, getOutputFormatOptions } from '@/utils'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool/tool-page'
import ToolCentered from '@/components/tool/tool-centered'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool/tool-action'
import ToolCompletion from '@/components/tool/tool-completion'
import { useFile } from '@/store/use-file'

const Convert = () => {
  const file = useFile((s) => s.file!)

  const [format, setFormat] = useState<SupportedOutputFormat>()
  const fileType = getFileType(file)

  const outputFormatOptions = getOutputFormatOptions(fileType)

  const { progress, execute, cancel, save } = useConversion()

  async function handleConvert() {
    if (!format) return

    await convertWithErrorHandler(() => execute({ format }))
  }

  return (
    <ToolContainer>
      <ToolMain showPlayer={false}>
        <SelectBox
          label="Format"
          value={format}
          onValueChange={(v) => setFormat(v as SupportedOutputFormat)}
          placeholder="Select a format"
          groupLabel="Formats"
          options={outputFormatOptions}
        />
        {progress < 1 && <ToolAction onClick={handleConvert} disabled={!format} />}
        {progress > 1 && (
          <ToolCompletion progress={progress} handleSave={() => save(format)} cancel={cancel} />
        )}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage>
      <ToolCentered>
        <Convert />
      </ToolCentered>
    </ToolPage>
  )
}

export default Page
