import { ALL_FORMATS, FilePathSource, FilePathTarget, Input } from 'mediabunny'

export function onProgress(progress: number) {
  process.stdout.write(`\rProgress: ${(progress * 100).toFixed(1)}%`)
}

export function getFileInput(filePath: string) {
  return new Input({
    source: new FilePathSource(filePath),
    formats: ALL_FORMATS
  })
}

export function getFileOutputTarget(ext: string) {
  return new FilePathTarget(`result${ext}`)
}
