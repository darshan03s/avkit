'use client'

import { useState } from 'react'
import Main from './main'
import FileInput from './file-input'
import { Button } from './ui/button'
import { tools } from '@/tools'
import { usePathname } from 'next/navigation'

type ToolPageProps = {
  description: string
  children: (file: File) => React.ReactNode
}

export function ToolPage({ description, children }: ToolPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const pathname = usePathname()
  const heading = tools.find((t) => t.path === pathname)?.description

  return (
    <Main>
      {!file ? (
        <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center">
          <div className="space-y-4">
            <h1 className="text-center font-sans font-bold text-xl">{heading}</h1>
            <FileInput setFile={setFile} description={description} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] h-full">
          <div className="flex justify-between items-center px-4 h-10">
            <div className="font-semibold">{heading}</div>
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>

          {children(file)}
        </div>
      )}
    </Main>
  )
}
