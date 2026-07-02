'use client'

import { useEffect, useMemo, useState } from 'react'
import Main from '../main'
import FileInput from '../file-input'
import { Button } from '../ui/button'
import { tools } from '@/tools'
import { usePathname } from 'next/navigation'
import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'
import { getInputData } from '@/utils/mediabunny'
import { InputMediaData } from '@/types/mediabunny'

type ToolPageProps = {
  description: string
  children: (file: File, fileInput: Input, fileData: InputMediaData) => React.ReactNode
  acceptAudio?: boolean
  acceptVideo?: boolean
}

export function ToolPage({
  description,
  children,
  acceptAudio = true,
  acceptVideo = true
}: ToolPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<InputMediaData | null>(null)

  const pathname = usePathname()
  const heading = tools.find((t) => t.path === pathname)?.description

  const fileInput = useMemo(() => {
    if (!file) return null

    return new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file)
    })
  }, [file])

  useEffect(() => {
    if (!fileInput) return
    getInputData(fileInput).then(setFileData)
  }, [fileInput])

  return (
    <Main>
      {!file ? (
        <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center">
          <div className="space-y-4 w-full max-w-80 md:max-w-100 lg:max-w-125 mx-auto">
            <h1 className="text-center font-sans font-bold md:text-xl text-lg">{heading}</h1>
            <FileInput
              setFile={setFile}
              description={description}
              acceptAudio={acceptAudio}
              acceptVideo={acceptVideo}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] h-full">
          <div className="flex justify-between items-center px-4 h-10">
            <div className="font-semibold">{heading}</div>
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>

          {fileInput && fileData ? children(file, fileInput, fileData) : null}
        </div>
      )}
    </Main>
  )
}
