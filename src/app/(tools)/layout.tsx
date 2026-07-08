import { ToolCentered } from '@/components/tool/tool-centered'
import { ToolPage } from '@/components/tool/tool-page'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToolPage>
      <ToolCentered>{children}</ToolCentered>
    </ToolPage>
  )
}

export default Layout
