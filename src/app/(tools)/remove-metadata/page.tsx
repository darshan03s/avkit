'use client'

import DetailsDialog from '@/components/details-dialog'
import Info from '@/components/info'
import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'

const RemoveMetadata = ({ file, fileInput, fileData }: ToolPageProps) => {
  const { conversion, execute, progress, reset, cancel } = useConversion()
  const metadataTags = fileData.metadataTags

  async function handleRemoveMetadata() {
    await convertWithErrorHandler(() => execute(fileInput, { removeMetadata: true }))
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData} className="xl:max-w-2xl">
        <div className="info grid grid-cols-2 lg:grid-cols-3 gap-2">
          {metadataTags ? (
            <>
              <DetailsDialog
                title="Artist"
                description={'Artist'}
                data={<div>{metadataTags.artist ?? 'N/A'}</div>}
              >
                <Info title="Artist" description={metadataTags.artist ?? 'N/A'} />
              </DetailsDialog>
              <Info title="Genre" description={metadataTags.genre ?? 'N/A'} />
              <Info title="Album" description={metadataTags.album ?? 'N/A'} />
              <Info title="Album artist" description={metadataTags.albumArtist ?? 'N/A'} />
              <Info
                title="Date"
                description={
                  metadataTags.date ? new Date(metadataTags.date).toLocaleString() : 'N/A'
                }
              />
              <DetailsDialog
                title="Description"
                description={'Description'}
                data={<div>{metadataTags.description ?? 'N/A'}</div>}
              >
                <Info title="Description" description={metadataTags.description ?? 'N/A'} />
              </DetailsDialog>
              <Info title="Tracks total" description={metadataTags.tracksTotal ?? 'N/A'} />
              <DetailsDialog
                title="Lyrics"
                description={'Lyrics'}
                data={<div>{metadataTags.lyrics ?? 'N/A'}</div>}
              >
                <Info title="Lyrics" description={metadataTags.lyrics ?? 'N/A'} />
              </DetailsDialog>
            </>
          ) : null}
        </div>
        {progress < 1 && <ToolAction onClick={handleRemoveMetadata} disabled={!metadataTags} />}
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
          <RemoveMetadata file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
