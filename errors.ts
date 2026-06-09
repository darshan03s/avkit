import { DiscardedTrack } from 'mediabunny'

export class ConversionError extends Error {
  discardedTracks: DiscardedTrack[] = []
  constructor(discardedTracks: DiscardedTrack[]) {
    super('Conversion Failed')
    this.discardedTracks = discardedTracks
  }
}

export class DecodabilityError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class EncodabilityError extends Error {
  constructor(message: string) {
    super(message)
  }
}
