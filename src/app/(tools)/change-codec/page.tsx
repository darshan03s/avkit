'use client'

import { useState } from 'react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import {
  convertWithErrorHandler,
  getCodecOptions,
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
import { AudioCodec, VideoCodec } from 'mediabunny'
import ShowTracks from '@/components/show-tracks'
import { ToolPageProps } from '@/types'
import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool-action'
import ToolCompletion from '@/components/tool-completion'

const ChangeCodec = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [codec, setCodec] = useState<AudioCodec | VideoCodec | ''>('')
  const [format, setFormat] = useState<SupportedOutputFormat | ''>('')
  const fileType = getFileType(file)

  const outputFormatOptions = getOutputFormatOptions(fileType)
  const codecOptions = getCodecOptions(fileType)

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleChangeCodec() {
    if (!format || !codec) return

    await convertWithErrorHandler(() => execute(fileInput, { format, codec, type: fileType }))
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format as SupportedOutputFormat)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        {fileData.tracksData.length > 0 ? (
          <div className="space-y-2">
            <ShowTracks
              data={fileData}
              onlyAudio={fileType === 'audio'}
              onlyVideo={fileType === 'video'}
            />
          </div>
        ) : (
          <div className="text-center">No tracks to change codec</div>
        )}
        <SelectBox
          label="Format"
          onValueChange={(v) => setFormat(v as SupportedOutputFormat)}
          value={format}
          placeholder="Select a format"
          groupLabel="Formats"
          options={outputFormatOptions}
        />
        <SelectBox
          label="Codec"
          onValueChange={(v) => setCodec(v as AudioCodec | VideoCodec)}
          value={codec}
          placeholder="Select a codec"
          groupLabel="Codecs"
          options={codecOptions}
        />
        {progress < 1 && <ToolAction onClick={handleChangeCodec} disabled={!format || !codec} />}
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
          <ChangeCodec file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
