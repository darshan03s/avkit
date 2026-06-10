import { InputMediaData } from '@/types/mediabunny'
import { Item, ItemContent, ItemTitle } from './ui/item'
import { Badge } from './ui/badge'
import { formatBitrate, truncateTo2Decimals } from '@/utils'

const ShowTracks = ({
  data,
  onlyAudio = false,
  onlyVideo = false
}: {
  data: InputMediaData
  onlyAudio?: boolean
  onlyVideo?: boolean
}) => {
  return (
    <>
      {data.tracksData.map((track) => {
        if (onlyAudio && !track.isAudio) return null
        if (onlyVideo && !track.isVideo) return null
        return (
          <Item key={track.id} variant={'outline'}>
            <ItemContent>
              <ItemTitle>{track.type}</ItemTitle>
              <div className="flex items-center gap-2 *:text-[10px]">
                <Badge>Lang: {track.lang}</Badge>
                <Badge>Codec: {track.codec}</Badge>
                <Badge>Codec string: {track.codecParamString}</Badge>
                <Badge>Average bitrate: {formatBitrate(track.averageBitrate)}</Badge>
                {track.frameRate && <Badge>FPS: {truncateTo2Decimals(track.frameRate)}</Badge>}
              </div>
            </ItemContent>
          </Item>
        )
      })}
    </>
  )
}
export default ShowTracks
