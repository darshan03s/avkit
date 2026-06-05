'use client'

import Player from '@/components/player'
import { ToolPage } from '@/components/tool-page'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { useInput } from '@/hooks/use-input'
import { useMediaData } from '@/hooks/use-media-data'
import { formatBytes } from '@/utils'

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
  const input = useInput(file)
  const data = useMediaData(input)

  if (!data) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto pb-4">
      <div className="space-y-3">
        <Player data={data} file={file} />
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
  return (
    <ToolPage description="Upload audio or video">
      {(file) => (
        <div className="flex-1">
          <ShowMetadata file={file} />
        </div>
      )}
    </ToolPage>
  )
}

export default Page
