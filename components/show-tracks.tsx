import { InputMediaData } from '@/types/mediabunny'
import { Item, ItemContent, ItemTitle } from './ui/item'
import { Badge } from './ui/badge'
import { formatBitrate, truncateTo2Decimals } from '@/utils'
import { cn } from '@/lib/utils'

const ShowTracks = ({
  data,
  onlyAudio = false,
  onlyVideo = false,
  onTrackClick,
  activeTrack
}: {
  data: InputMediaData
  onlyAudio?: boolean
  onlyVideo?: boolean
  onTrackClick?: (id: number) => void
  activeTrack?: string | Set<number>
}) => {
  function isActive(trackId: number) {
    if (typeof activeTrack === 'string') {
      return activeTrack === String(trackId)
    } else if (activeTrack instanceof Set) {
      return activeTrack.has(trackId)
    }

    return false
  }

  return (
    <>
      {data.tracksData.map((track) => {
        if (onlyAudio && !track.isAudio) return null
        if (onlyVideo && !track.isVideo) return null
        return (
          <Item
            key={track.id}
            variant={'outline'}
            onClick={onTrackClick ? () => onTrackClick(track.id) : undefined}
            className={cn(`${isActive(track.id) && 'bg-primary/20'} cursor-pointer`)}
          >
            <ItemContent>
              <ItemTitle>{track.type}</ItemTitle>
              <div className="flex items-center gap-1 *:text-[10px]">
                <Badge>Lang: {track.lang}</Badge>
                <Badge>Codec: {track.codec}</Badge>
                <Badge>Codec string: {track.codecParamString}</Badge>
                <Badge className="hidden lg:inline">
                  Average bitrate: {formatBitrate(track.averageBitrate)}
                </Badge>
                {track.frameRate && (
                  <Badge className="hidden lg:inline">
                    FPS: {truncateTo2Decimals(track.frameRate)}
                  </Badge>
                )}
              </div>
            </ItemContent>
          </Item>
        )
      })}
    </>
  )
}
export default ShowTracks
