'use client'

import FileInput from '@/components/file-input'
import Main from '@/components/main'
import { Button } from '@/components/ui/button'
import {
  convertFormat,
  SUPPORTED_AUDIO_OUTPUT_FORMATS,
  SUPPORTED_VIDEO_OUTPUT_FORMATS
} from '@/utils/mediabunny'
import { ALL_FORMATS, BlobSource, BufferTarget, Conversion, Input } from 'mediabunny'
import { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Repeat2 } from 'lucide-react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { Progress } from '@/components/ui/progress'

const Convert = ({ file }: { file: File }) => {
  const [format, setFormat] = useState<SupportedOutputFormat>()
  const [progress, setProgress] = useState<number>(0)
  const [conversion, setConversion] = useState<Conversion | null>(null)
  const type = file.type

  const outputFormatOptions = type.startsWith('video')
    ? SUPPORTED_VIDEO_OUTPUT_FORMATS
    : SUPPORTED_AUDIO_OUTPUT_FORMATS

  const input = useMemo(
    () =>
      new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(file)
      }),
    [file]
  )

  const onProgress = (progress: number) => {
    setProgress(Number((progress * 100).toFixed(0)))
  }

  function handleConvert() {
    if (!format) return
    convertFormat(input, format, onProgress).then((conversion) => {
      setConversion(conversion)
    })
  }

  function saveBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  }

  async function handleSave() {
    if (!conversion) return

    const target = conversion.output.target

    if (!(target instanceof BufferTarget)) return

    const buffer = target.buffer

    if (!buffer) return

    const blob = new Blob([buffer], {
      type: file.type
    })

    saveBlob(blob, `${file.name.split('.').slice(0, -1).join('.')}.${format}`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="text-center font-semibold">{file.name}</div>
      <div className="flex justify-center">
        <Select onValueChange={(v) => setFormat(v as SupportedOutputFormat)} value={format}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Formats</SelectLabel>
              {outputFormatOptions.map((format) => {
                return (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleConvert}>
          <Repeat2 /> Convert
        </Button>
      </div>
      <div className="flex justify-center">
        <Progress value={progress} className="w-3xl h-4" />
      </div>
      <div className="flex justify-center">
        <Button disabled={progress < 100} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

const Page = () => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <Main>
      {!file ? (
        <FileInput setFile={setFile} description="Upload audio or video file to convert" />
      ) : (
        <>
          <div className="flex items-center justify-end p-2">
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>
          <Convert file={file} />
        </>
      )}
    </Main>
  )
}

export default Page
