import { Conversion } from 'mediabunny'
import { useState } from 'react'

export function useConversion() {
  const [progress, setProgress] = useState(0)
  const [conversion, setConversion] = useState<Conversion | null>(null)

  async function execute(fn: (onProgress: (progress: number) => void) => Promise<Conversion>) {
    const conversion = await fn((progress) => {
      setProgress(Math.round(progress * 100))
    })
    setConversion(conversion)
    try {
      await conversion.execute()
    } catch (e) {
      setConversion(null)
      throw e
    }
  }

  function reset() {
    setProgress(0)
    setConversion(null)
  }

  async function cancel() {
    if (!conversion) return
    setConversion(null)
    setProgress(0)
    await conversion.cancel()
  }

  return {
    progress,
    execute,
    reset,
    cancel,
    conversion
  }
}
