import { APP_NAME } from '@/data'
import Link from 'next/link'

const Brand = () => {
  const firstTwoLetters = APP_NAME.slice(0, 2)
  const remainingLetters = APP_NAME.slice(2)
  return (
    <Link href={'/'} className="font-bold">
      <span className="italic">{firstTwoLetters}</span>
      <span className="">{remainingLetters}</span>
    </Link>
  )
}

export default Brand
