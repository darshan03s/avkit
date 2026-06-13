import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Button } from './ui/button'

const DetailsDialog = ({
  children,
  title,
  description,
  data
}: {
  children: React.ReactNode
  title: string
  description: string
  data: React.ReactNode
}) => {
  return (
    <Dialog>
      <DialogTrigger className="h-full w-full">{children}</DialogTrigger>
      <DialogContent className="md:max-w-lg!">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] w-full">{data}</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DetailsDialog
