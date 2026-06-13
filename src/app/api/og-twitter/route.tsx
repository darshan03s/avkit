import { APP_NAME } from '@/metadata'
import { InstrumentSerifFontData } from '@/font'
import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: 'black',
        width: '100%',
        height: '100%',
        padding: '50px 200px',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: `
       radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%),
       radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%),
       radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%),
       radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%),
       #000000
     `
        }}
      />
      <span
        style={{
          fontFamily: 'Instrument Serif',
          fontSize: 180,
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        {APP_NAME}
      </span>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts: [
        {
          name: 'Instrument Serif',
          data: InstrumentSerifFontData,
          style: 'normal'
        }
      ]
    }
  )
}
