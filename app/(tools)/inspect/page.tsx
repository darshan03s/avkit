'use client'

import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
import { ToolPageProps } from '@/types'
import { formatBitrate, formatBytes, truncateTo2Decimals } from '@/utils'
import DetailsDialog from '@/components/details-dialog'
import Info from '@/components/info'

const Inspect = ({ file, fileData }: Omit<ToolPageProps, 'fileInput'>) => {
  return (
    <ToolContainer className="pb-4">
      <ToolMain file={file} fileData={fileData}>
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          <div className="info grid grid-cols-3 gap-2">
            <Info title="Size" description={formatBytes(fileData.size)} />
            <Info
              title="Last modified"
              description={new Date(file.lastModified).toLocaleString()}
            />
            <Info title="Format" description={fileData.format.name} />
            <Info title="MIME type" description={fileData.format.mimeType} />
            {fileData.metadataTags ? (
              <>
                <Info title="Artist" description={fileData.metadataTags.artist ?? 'N/A'} />
                <Info title="Genre" description={fileData.metadataTags.genre ?? 'N/A'} />
                <Info title="Album" description={fileData.metadataTags.album ?? 'N/A'} />
                <Info
                  title="Album artist"
                  description={fileData.metadataTags.albumArtist ?? 'N/A'}
                />
                <Info
                  title="Date"
                  description={
                    fileData.metadataTags.date
                      ? new Date(fileData.metadataTags.date).toLocaleString()
                      : 'N/A'
                  }
                />
                <DetailsDialog
                  title="Description"
                  description={'Description'}
                  data={<div>{fileData.metadataTags.description ?? 'N/A'}</div>}
                >
                  <Info
                    title="Description"
                    description={fileData.metadataTags.description ?? 'N/A'}
                  />
                </DetailsDialog>
                <Info
                  title="Tracks total"
                  description={fileData.metadataTags.tracksTotal ?? 'N/A'}
                />
                <DetailsDialog
                  title="Lyrics"
                  description={'Lyrics'}
                  data={<div>{fileData.metadataTags.lyrics ?? 'N/A'}</div>}
                >
                  <Info title="Lyrics" description={fileData.metadataTags.lyrics ?? 'N/A'} />
                </DetailsDialog>
              </>
            ) : null}
          </div>
          <div className="tracks">
            <Item variant={'outline'}>
              <ItemContent>
                <ItemTitle className="p-2 font-bold">Tracks</ItemTitle>
                <div className="space-y-4">
                  {fileData.tracksData.map((track) => {
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
                                {track.averageBitrate ? formatBitrate(track.averageBitrate) : 'N/A'}
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
                            {track.isVideo && (
                              <>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Frame rate</ItemTitle>
                                    {track.frameRate ? truncateTo2Decimals(track.frameRate) : 'N/A'}
                                  </ItemContent>
                                </Item>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Coded height</ItemTitle>
                                    {track.codedHeight ?? 'N/A'}
                                  </ItemContent>
                                </Item>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Coded width</ItemTitle>
                                    {track.codedWidth ?? 'N/A'}
                                  </ItemContent>
                                </Item>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Display height</ItemTitle>
                                    {track.displayHeight ?? 'N/A'}
                                  </ItemContent>
                                </Item>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Display width</ItemTitle>
                                    {track.displayWidth ?? 'N/A'}
                                  </ItemContent>
                                </Item>
                              </>
                            )}
                            {track.isAudio && (
                              <>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Sample rate</ItemTitle>
                                    {track.sampleRate ?? 'N/A'}
                                  </ItemContent>
                                </Item>
                                <Item variant={'outline'}>
                                  <ItemContent>
                                    <ItemTitle>Channels</ItemTitle>
                                    {track.channels ?? 'N/A'}
                                  </ItemContent>
                                </Item>
                              </>
                            )}
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
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import audio or video">
      {(file, _, fileData) => (
        <div className="flex-1">
          <Inspect file={file} fileData={fileData} />
        </div>
      )}
    </ToolPage>
  )
}

export default Page
