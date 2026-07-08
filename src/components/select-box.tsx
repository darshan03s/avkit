import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'

export const SelectBox = ({
  onValueChange,
  value,
  placeholder,
  groupLabel,
  options,
  label
}: {
  onValueChange?: (val: unknown) => void
  value: string | undefined
  placeholder: string
  groupLabel: string
  options: string[]
  label: string
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        onValueChange={onValueChange ? (v: unknown) => onValueChange(v) : undefined}
        value={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{groupLabel}</SelectLabel>
            {options.map((option: string) => {
              return (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
