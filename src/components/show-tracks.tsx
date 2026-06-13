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
  activeTrack,
  label
}: {
  data: InputMediaData
  onlyAudio?: boolean
  onlyVideo?: boolean
  onTrackClick?: (id: number) => void
  activeTrack?: string | Set<number>
  label?: string
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
    <div className="space-y-2">
      <div className="text-sm">{label}</div>
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
            <ItemContent className="space-y-2">
              <ItemTitle>
                {track.type}{' '}
                <Badge variant={'secondary'} className="text-[10px]">
                  {' '}
                  Lang: {track.lang}
                </Badge>
              </ItemTitle>
              <div className="flex items-center gap-1 *:text-[10px]">
                <Badge>
                  Codec: {track.codec} ({track.codecParamString})
                </Badge>
                <Badge>ABR: {formatBitrate(track.averageBitrate)}</Badge>
                {track.frameRate && (
                  <Badge className="">FPS: {truncateTo2Decimals(track.frameRate)}</Badge>
                )}
              </div>
            </ItemContent>
          </Item>
        )
      })}
    </div>
  )
}
export default ShowTracks
