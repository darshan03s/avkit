'use client'

import { useState } from 'react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import {
  convertWithErrorHandler,
  getFilename,
  getFileType,
  getOutputFormatOptions,
  saveOutput
} from '@/utils'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool-page'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPageProps } from '@/types'
import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool-action'
import ToolCompletion from '@/components/tool-completion'

const Convert = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [format, setFormat] = useState<SupportedOutputFormat>()
  const fileType = getFileType(file)

  const outputFormatOptions = getOutputFormatOptions(fileType)

  const { progress, execute, reset, cancel, conversion } = useConversion()

  async function handleConvert() {
    if (!format) return

    await convertWithErrorHandler(() => execute(fileInput, { format }))
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format!)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData} showPlayer={false}>
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
          <ToolCompletion progress={progress} handleSave={handleSave} cancel={cancel} />
        )}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import audio or video">
      {(file, fileInput, fileData) => (
        <ToolCentered>
          <Convert file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
