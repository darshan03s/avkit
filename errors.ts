import { DiscardedTrack } from 'mediabunny'

export class ConversionError extends Error {
  discardedTracks: DiscardedTrack[] = []
  constructor(discardedTracks: DiscardedTrack[]) {
    super('Conversion Failed')
    this.discardedTracks = discardedTracks
  }
}
