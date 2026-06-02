import { APP_NAME } from '@/data'
import Link from 'next/link'

const Brand = () => {
  return (
    <Link href={'/'} className="font-semibold">
      {APP_NAME}
    </Link>
  )
}

export default Brand
