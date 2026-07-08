'use client'

import { useEffect, useMemo } from 'react'
import Main from '../main'
import FileInput from '../file-input'
import { Button } from '../ui/button'
import { tools } from '@/tools'
import { usePathname } from 'next/navigation'
import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'
import { getInputData } from '@/utils/mediabunny'
import { InputMediaData } from '@/types/mediabunny'
import { useFile } from '@/store/use-file'
import { RotateCcw } from 'lucide-react'

type ToolPageProps = {
  children: (file: File, fileData: InputMediaData) => React.ReactNode
}

export function ToolPage({ children }: ToolPageProps) {
  const { file, fileData, reset, setFile, setFileInput, setFileData } = useFile()

  useEffect(() => {
    reset()
  }, [reset])

  const pathname = usePathname()
  const heading = tools[pathname]!.description
  const inputDescription = tools[pathname]!.inputDescription
  const accept = tools[pathname]!.accept

  const fileInput = useMemo(() => {
    if (!file) return null

    return new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file)
    })
  }, [file])

  useEffect(() => {
    if (!fileInput) return
    setFileInput(fileInput)
    getInputData(fileInput).then((fileData) => setFileData(fileData))
  }, [fileInput, setFileInput, setFileData])

  return (
    <Main>
      {!file ? (
        <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center">
          <div className="space-y-4 w-full max-w-80 md:max-w-100 lg:max-w-125 mx-auto">
            <h1 className="text-center font-heading font-bold md:text-xl text-lg">{heading}</h1>
            <FileInput setFile={setFile} accept={accept} inputDescription={inputDescription} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] h-full">
          <div className="flex justify-between items-center px-4 h-10">
            <div className="font-semibold font-heading">{heading}</div>
            <Button className="text-xs px-4 font-mono" onClick={() => setFile(null)}>
              <RotateCcw className="size-3" />
              Clear
            </Button>
          </div>

          {fileInput && fileData ? children(file, fileData) : null}
        </div>
      )}
    </Main>
  )
}
