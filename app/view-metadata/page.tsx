'use client'

import FileInput from '@/components/file-input'
import Main from '@/components/main'
import Player from '@/components/player'
import { Button } from '@/components/ui/button'
import { InputMediaData } from '@/types/mediabunny'
import { getInputData } from '@/utils/mediabunny'
import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'
import { useEffect, useState } from 'react'

const ShowMetadata = ({ file }: { file: File }) => {
  const [data, setData] = useState<InputMediaData | null>(null)
  const fileUrl = URL.createObjectURL(file)

  useEffect(() => {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(file)
    })

    async function getData() {
      const d = await getInputData(input)
      setData(d)
    }

    getData()
  }, [file])

  if (!data) {
    return null
  }

  const image = data.metadata.images?.[0]

  const posterUrl = image
    ? URL.createObjectURL(
        new Blob([new Uint8Array(image.data)], {
          type: image.mimeType
        })
      )
    : undefined

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-3">
        <h1 className="text-xl text-center line-clamp-2">{file.name}</h1>
        <Player mimeType={data.format.mimeType} fileUrl={fileUrl} posterUrl={posterUrl} />
      </div>
    </div>
  )
}

const Page = () => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <Main>
      {!file ? (
        <FileInput setFile={setFile} />
      ) : (
        <>
          <div className="flex items-center justify-end p-2">
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>
          <ShowMetadata file={file} />
        </>
      )}
    </Main>
  )
}

export default Page
