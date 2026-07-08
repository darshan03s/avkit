'use client'

import { useState } from 'react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import {
  convertWithErrorHandler,
  getCodecOptions,
  getFileType,
  getOutputFormatOptions
} from '@/utils'
import { useConversion } from '@/hooks/use-conversion'
import { ToolContainer } from '@/components/tool/tool-container'
import { ToolMain } from '@/components/tool/tool-main'
import { AudioCodec, VideoCodec } from 'mediabunny'
import { ShowTracks } from '@/components/show-tracks'
import { SelectBox } from '@/components/select-box'
import { ToolAction } from '@/components/tool/tool-action'
import { ToolCompletion } from '@/components/tool/tool-completion'
import { useFile } from '@/store/use-file'

const ChangeCodec = () => {
  const file = useFile((s) => s.file!)
  const fileData = useFile((s) => s.fileData!)

  const [codec, setCodec] = useState<AudioCodec | VideoCodec | ''>('')
  const [format, setFormat] = useState<SupportedOutputFormat | undefined>(undefined)
  const fileType = getFileType(file)

  const outputFormatOptions = getOutputFormatOptions(fileType)
  const codecOptions = getCodecOptions(fileType)

  const { progress, execute, cancel, save } = useConversion()

  async function handleChangeCodec() {
    if (!format || !codec) return

    await convertWithErrorHandler(() => execute({ format, codec, type: fileType }))
  }

  return (
    <ToolContainer>
      <ToolMain>
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
        <div className="grid grid-cols-2 gap-2">
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
        </div>
        {progress < 1 && <ToolAction onClick={handleChangeCodec} disabled={!format || !codec} />}
        {progress > 1 && (
          <ToolCompletion progress={progress} handleSave={() => save(format)} cancel={cancel} />
        )}
      </ToolMain>
    </ToolContainer>
  )
}

export default ChangeCodec
