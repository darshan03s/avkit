import Features from '@/components/features'
import Main from '@/components/main'
import { buttonVariants } from '@/components/ui/button'
import { TextAnimate } from '@/components/ui/text-animate'
import { cn } from '@/lib/utils'
import { CornerDownRight } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  return (
    <Main className="flex items-center justify-center relative">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(var(--foreground) 1px, transparent 1px),
          linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
        `,
          backgroundSize: '60px 60px',
          opacity: 0.1,
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
      <div className="flex flex-col gap-8 md:gap-4 z-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-7xl font-bold text-center">
            <TextAnimate animation="blurInUp" by="character" once>
              Audio & Video tools
            </TextAnimate>
          </h1>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-sm md:text-lg text-muted-foreground text-center"
          >
            Right in your browser
          </TextAnimate>
        </div>
        <Features />
        <div className="flex justify-center">
          <Link
            href="/inspect"
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'px-4 py-2')}
          >
            <CornerDownRight />
            Get started
          </Link>
        </div>
      </div>
    </Main>
  )
}

export default Page
