"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cva } from "class-variance-authority"
import { ScrollArea } from "@/components/ui/scroll-area"

const comboBoxVariants = cva(
  "w-[200px] justify-between py-0 px-2 h-9 border-0"
)

type ComboboxProps = {
  options: {
    value: string
    label: string
  }[];
  defaultSelect?: string;
  type: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export function Combobox({
  options,
  defaultSelect,
  type,
  placeholder,
  onSelect,
  className
}: 
  ComboboxProps
) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultSelect ?? "")

  placeholder = placeholder ? placeholder : `Select ${type}...`

  React.useEffect(() => {
    if (defaultSelect) {
      setValue(defaultSelect)
    } else {
      setValue("")
    }
  }, [defaultSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((framework) => framework.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${type}...`} />
          <CommandList>
            <CommandEmpty>No {type} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onSelect && onSelect(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
