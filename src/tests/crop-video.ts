import { cropVideo, getOutputFormatForInputFormat } from '@/utils/mediabunny'
import { registerMediabunnyServer } from '@mediabunny/server'
import { onProgress, getFileInput, getFileOutputTarget } from './utils'

registerMediabunnyServer()

async function main() {
  const filePath = process.argv[2]
  const crop = {
    left: Number(process.argv[3]),
    top: Number(process.argv[4]),
    width: Number(process.argv[5]),
    height: Number(process.argv[6])
  }

  const input = getFileInput(filePath)

  const inputFormat = await input.getFormat()
  const outputFormat = getOutputFormatForInputFormat(inputFormat)

  const target = getFileOutputTarget(outputFormat.fileExtension)

  const conversion = await cropVideo(input, crop, onProgress, target)
  await conversion.execute()
}

main()
