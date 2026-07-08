import { APP_NAME } from '@/metadata'
import Link from 'next/link'

export const Brand = () => {
  const firstTwoLetters = APP_NAME.slice(0, 2)
  const remainingLetters = APP_NAME.slice(2)
  return (
    <Link href={'/'} className="font-bold font-brand">
      <span className="italic">{firstTwoLetters}</span>
      <span className="">{remainingLetters}</span>
    </Link>
  )
}
