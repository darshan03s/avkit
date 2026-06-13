import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'

const Info = ({
  title,
  description
}: {
  title: string
  description: string | number | null | undefined
}) => {
  return (
    <Item variant={'outline'}>
      <ItemContent className="overflow-hidden text-ellipsis h-12">
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription className="line-clamp-1">{description}</ItemDescription>
      </ItemContent>
    </Item>
  )
}

export default Info
