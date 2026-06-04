'use client'

import { SupportedOutputFormat } from '@/types/mediabunny'
import { BufferTarget, Conversion } from 'mediabunny'

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
  file: File,
  format: SupportedOutputFormat | undefined
) {
  if (!conversion) return

  const target = conversion.output.target

  if (!(target instanceof BufferTarget)) return

  const buffer = target.buffer

  if (!buffer) return

  const blob = new Blob([buffer], {
    type: file.type
  })

  saveBlob(blob, `${file.name.split('.').slice(0, -1).join('.')}.${format}`)
}
