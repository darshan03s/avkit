import Image from 'next/image'

const Player = ({
  mimeType,
  fileUrl,
  posterUrl
}: {
  mimeType: string
  fileUrl: string
  posterUrl: string | undefined
}) => {
  return (
    <div className="player flex items-center justify-center">
      {mimeType.startsWith('video') ? (
        <video
          src={fileUrl}
          controls={true}
          poster={posterUrl}
          className="aspect-video w-100 rounded-md outline"
        ></video>
      ) : (
        <>
          {posterUrl ? (
            <div className="flex flex-col items-center">
              <Image
                src={posterUrl}
                alt="poster"
                width={400}
                height={300}
                className="rounded-md aspect-video"
              />
              <audio src={fileUrl} controls className="relative bottom-9 w-full h-8 px-2"></audio>
            </div>
          ) : (
            <audio src={fileUrl} controls></audio>
          )}
        </>
      )}
    </div>
  )
}

export default Player
