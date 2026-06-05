'use client'

import { ConversionError } from '@/errors'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { BufferTarget, Conversion } from 'mediabunny'
import { toast } from 'sonner'

export function formatBytes(bytes: number | null): string {
  if (!bytes) return '0B'

  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

export async function saveOutput(
  conversion: Conversion | null,
  fileName: string,
  format: SupportedOutputFormat
) {
  if (!conversion) return

  const target = conversion.output.target

  if (!(target instanceof BufferTarget)) return

  const buffer = target.buffer

  if (!buffer) return

  const blob = new Blob([buffer])

  const completeFilename = `${fileName}.${format}`

  saveBlob(blob, completeFilename)
}

export function convertToSeconds(val: string): number {
  const parts = val.split(':')

  if (parts.length < 2 || parts.length > 4) {
    throw new Error('Invalid time format')
  }

  const numbers = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error('Invalid time format')
    }

    return Number(part)
  })

  let seconds = 0

  if (numbers.length === 2) {
    const [minutes, secs] = numbers
    seconds = minutes * 60 + secs
  } else if (numbers.length === 3) {
    const [hours, minutes, secs] = numbers
    seconds = hours * 3600 + minutes * 60 + secs
  } else {
    const [days, hours, minutes, secs] = numbers
    seconds = days * 86400 + hours * 3600 + minutes * 60 + secs
  }

  return seconds
}

export function isValidDuration(value: string): boolean {
  const parts = value.split(':')

  if (parts.length < 2 || parts.length > 4) {
    return false
  }

  if (!parts.every((part) => /^\d+$/.test(part))) {
    return false
  }

  const nums = parts.map(Number)

  switch (parts.length) {
    case 2: {
      const [, seconds] = nums
      return seconds >= 0 && seconds <= 59
    }

    case 3: {
      const [, minutes, seconds] = nums
      return minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59
    }

    case 4: {
      const [, hours, minutes, seconds] = nums
      return (
        hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59
      )
    }

    default:
      return false
  }
}

export function getExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.')

  return filename.slice(lastDot + 1) as SupportedOutputFormat
}

export function getFilename(filename: string): string {
  const lastDot = filename.lastIndexOf('.')

  if (lastDot <= 0) {
    return filename
  }

  return filename.slice(0, lastDot)
}

export async function convertWithErrorHandler<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof ConversionError) {
      error.discardedTracks.forEach((track) => {
        toast.error(String(track.reason))
      })

      return
    }

    toast.error('Conversion failed')
  }
}
