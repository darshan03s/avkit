'use client'

import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { formatBitrate, formatBytes, truncateTo2Decimals } from '@/utils'
import DetailsDialog from '@/components/details-dialog'
import Info from '@/components/info'
import { useFile } from '@/store/use-file'

const Inspect = () => {
  const file = useFile((s) => s.file!)
  const fileData = useFile((s) => s.fileData!)

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData} className="xl:max-w-2xl">
        <div className="info grid grid-cols-2 lg:grid-cols-3 gap-2">
          <Info title="Size" description={formatBytes(fileData.size)} />
          <DetailsDialog
            title="Last modified"
            description="Last modified"
            data={<div>{new Date(file.lastModified).toLocaleString()}</div>}
          >
            <Info
              title="Last modified"
              description={new Date(file.lastModified).toLocaleString()}
            />
          </DetailsDialog>
          <Info title="Format" description={fileData.format.name} />
          <Info title="MIME type" description={fileData.format.mimeType} />
          {fileData.metadataTags ? (
            <>
              <DetailsDialog
                title="Artist"
                description="Artist"
                data={<div>{fileData.metadataTags.artist ?? 'N/A'}</div>}
              >
                <Info title="Artist" description={fileData.metadataTags.artist ?? 'N/A'} />
              </DetailsDialog>
              <Info title="Genre" description={fileData.metadataTags.genre ?? 'N/A'} />
              <Info title="Album" description={fileData.metadataTags.album ?? 'N/A'} />
              <Info title="Album artist" description={fileData.metadataTags.albumArtist ?? 'N/A'} />
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
              <Info title="Tracks total" description={fileData.metadataTags.tracksTotal ?? 'N/A'} />
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
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Id</ItemTitle>
                              <ItemDescription>{track.id}</ItemDescription>
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Average bitrate</ItemTitle>
                              <ItemDescription>
                                {track.averageBitrate ? formatBitrate(track.averageBitrate) : 'N/A'}
                              </ItemDescription>
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Codec</ItemTitle>
                              <ItemDescription>{track.codec ?? 'N/A'}</ItemDescription>
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Codec string</ItemTitle>
                              <ItemDescription>{track.codecParamString ?? 'N/A'}</ItemDescription>
                            </ItemContent>
                          </Item>
                          <Item variant={'outline'}>
                            <ItemContent>
                              <ItemTitle>Language</ItemTitle>
                              <ItemDescription>{track.lang ?? 'N/A'}</ItemDescription>
                            </ItemContent>
                          </Item>
                          {track.isVideo && (
                            <>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Frame rate</ItemTitle>
                                  <ItemDescription>
                                    {track.frameRate ? truncateTo2Decimals(track.frameRate) : 'N/A'}
                                  </ItemDescription>
                                </ItemContent>
                              </Item>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Coded height</ItemTitle>
                                  <ItemDescription>{track.codedHeight ?? 'N/A'}</ItemDescription>
                                </ItemContent>
                              </Item>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Coded width</ItemTitle>
                                  <ItemDescription>{track.codedWidth ?? 'N/A'}</ItemDescription>
                                </ItemContent>
                              </Item>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Display height</ItemTitle>
                                  <ItemDescription>{track.displayHeight ?? 'N/A'}</ItemDescription>
                                </ItemContent>
                              </Item>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Display width</ItemTitle>
                                  <ItemDescription>{track.displayWidth ?? 'N/A'}</ItemDescription>
                                </ItemContent>
                              </Item>
                            </>
                          )}
                          {track.isAudio && (
                            <>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Sample rate</ItemTitle>
                                  <ItemDescription>{track.sampleRate ?? 'N/A'}</ItemDescription>
                                </ItemContent>
                              </Item>
                              <Item variant={'outline'}>
                                <ItemContent>
                                  <ItemTitle>Channels</ItemTitle>
                                  <ItemDescription>{track.channels ?? 'N/A'}</ItemDescription>
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
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage>
      <div className="flex-1">
        <Inspect />
      </div>
    </ToolPage>
  )
}

export default Page
