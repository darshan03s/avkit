'use client'

import { useState } from 'react'
import Main from './main'
import FileInput from './file-input'
import { Button } from './ui/button'

type ToolPageProps = {
  description: string
  children: (file: File) => React.ReactNode
}

export function ToolPage({ description, children }: ToolPageProps) {
  const [file, setFile] = useState<File | null>(null)

  return (
    <Main>
      {!file ? (
        <FileInput setFile={setFile} description={description} />
      ) : (
        <>
          <div className="flex justify-end p-2">
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>

          {children(file)}
        </>
      )}
    </Main>
  )
}
