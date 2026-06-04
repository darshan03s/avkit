import { InputMediaData } from '@/types/mediabunny'
import { getInputData } from '@/utils/mediabunny'
import { Input } from 'mediabunny'
import { useEffect, useState } from 'react'

export function useMediaData(input: Input) {
  const [data, setData] = useState<InputMediaData | null>(null)

  useEffect(() => {
    getInputData(input).then(setData)
  }, [input])

  return data
}
