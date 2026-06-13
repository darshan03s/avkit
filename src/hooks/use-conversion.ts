import { Conversion } from 'mediabunny'
import { useState } from 'react'

export function useConversion() {
  const [progress, setProgress] = useState(0)
  const [conversion, setConversion] = useState<Conversion | null>(null)

  async function execute(fn: (onProgress: (progress: number) => void) => Promise<Conversion>) {
    const conversion = await fn((progress) => {
      const prog = Math.round(progress * 100)
      setProgress(prog)
    })

    setConversion(conversion)
  }

  function reset() {
    setProgress(0)
    setConversion(null)
  }

  return {
    progress,
    conversion,
    execute,
    reset
  }
}
