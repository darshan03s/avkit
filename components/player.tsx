import { InputMediaData } from '@/types/mediabunny'
import { getFileType } from '@/utils'
import Image from 'next/image'
import { memo } from 'react'

const Player = ({ data, file }: { data: InputMediaData; file: File }) => {
  const fileUrl = URL.createObjectURL(file)
  const fileType = getFileType(file)

  console.log(fileType)

  const image = data.metadata.images?.[0]

  const posterUrl = image
    ? URL.createObjectURL(
        new Blob([new Uint8Array(image.data)], {
          type: image.mimeType
        })
      )
    : undefined

  return (
    <div className="player flex items-center justify-center">
      {fileType === 'video' ? (
        <video
          src={fileUrl}
          controls={true}
          poster={posterUrl}
          className="aspect-video w-140 rounded-md outline"
        ></video>
      ) : (
        <>
          {posterUrl ? (
            <div className="flex flex-col items-center">
              <Image
                src={posterUrl}
                alt="poster"
                width={480}
                height={300}
                className="rounded-md aspect-video"
              />
              <audio src={fileUrl} controls className="w-full h-10"></audio>
            </div>
          ) : (
            <audio src={fileUrl} controls></audio>
          )}
        </>
      )}
    </div>
  )
}

export default memo(Player)
