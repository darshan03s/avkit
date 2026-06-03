'use client'

import FileInput from '@/components/file-input'
import Main from '@/components/main'
import Player from '@/components/player'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { InputMediaData } from '@/types/mediabunny'
import { formatBytes } from '@/utils'
import { getInputData } from '@/utils/mediabunny'
import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'
import { useEffect, useState } from 'react'

const Info = ({
  title,
  description
}: {
  title: string
  description: string | number | null | undefined
}) => {
  return (
    <Item variant={'outline'}>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </Item>
  )
}

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
        <Player mimeType={data.format.mimeType} fileUrl={fileUrl} posterUrl={posterUrl} />
        <span className="text-md font-semibold text-center line-clamp-2">{file.name}</span>
        <div className="info grid grid-cols-3 gap-2">
          <Info title="Size" description={formatBytes(data.size)} />
          <Info title="Last modified" description={new Date(file.lastModified).toLocaleString()} />
          <Info title="Format" description={data.format.name} />
          <Info title="MIME type" description={data.format.mimeType} />
          {data.metadata ? (
            <>
              <Info title="Artist" description={data.metadata.artist ?? 'N/A'} />
              <Info title="Genre" description={data.metadata.genre ?? 'N/A'} />
            </>
          ) : null}
        </div>
        <div className="tracks">
          <Item variant={'outline'}>
            <ItemContent>
              <ItemTitle className="p-2 font-bold">Tracks</ItemTitle>
              <div className="space-y-4">
                {data.tracksData.map((track) => {
                  return (
                    <Item key={track.id} variant={'default'}>
                      <ItemContent>
                        <ItemTitle className="capitalize font-semibold">{track.type}</ItemTitle>
                        <div className="grid grid-cols-3 gap-2">
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Id</ItemTitle>
                              {track.id}
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Average bitrate</ItemTitle>
                              {track.averageBitrate ?? 'N/A'}
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Codec</ItemTitle>
                              {track.codec ?? 'N/A'}
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Codec string</ItemTitle>
                              {track.codecParamString ?? 'N/A'}
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Language</ItemTitle>
                              {track.lang ?? 'N/A'}
                            </ItemContent>
                          </Item>
                        </div>
                      </ItemContent>
                    </Item>
                  )
                })}
              </div>
            </ItemContent>
          </Item>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <Main className="pb-4">
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
