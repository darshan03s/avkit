import { cn } from '@/lib/utils'
import { IconBrandGithub } from '@tabler/icons-react'
import Link from 'next/link'
import { buttonVariants } from './ui/button'

export const GithubRepo = () => {
  return (
    <Link
      href="https://github.com/darshan03s/avkit"
      target="_blank"
      className={cn(buttonVariants({ variant: 'outline' }))}
    >
      <IconBrandGithub />
    </Link>
  )
}
