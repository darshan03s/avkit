'use client'

import { ALL_FORMATS, BlobSource, Input } from 'mediabunny'
import { useMemo } from 'react'

export function useInput(file: File) {
  return useMemo(
    () =>
      new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(file)
      }),
    [file]
  )
}
