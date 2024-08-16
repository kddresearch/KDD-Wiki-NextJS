"use client"

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SupportedTypes = number | string

interface DropdownRadioSelectProps<T extends SupportedTypes> {
  label: string;
  items: T[];
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}

const DropdownRadioSelect = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & DropdownRadioSelectProps<SupportedTypes>
>(({ children, label, items, value, onChange, defaultValue, ...props }, ref) => {
  if (items.length === 0) {
    throw new Error("Items must not be empty")
  }

  if (defaultValue === undefined) {
    defaultValue = items[0]
  }

  const [position, setPosition] = React.useState(defaultValue.toString())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" ref={ref} {...props}>Select {label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value ? value.toString() : position}
          onValueChange={(value) => {
            if (onChange) {
              onChange(value as typeof items[0]);
            } else {
              setPosition(value.toString());
            }
          }}
        >
          {items.map((item, index) => (
            <DropdownMenuRadioItem key={index} value={item.toString()}>
              {item}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

DropdownRadioSelect.displayName = "DropdownRadioSelect"

export {
  DropdownRadioSelect
}