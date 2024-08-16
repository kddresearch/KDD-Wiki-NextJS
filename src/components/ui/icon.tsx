"use client"

import * as React from "react"
import * as IconPrimitive from "./primative/icon"

import { cn } from "@/lib/utils"

const Icon = React.forwardRef<
  React.ElementRef<typeof IconPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof IconPrimitive.Root>
>(({ className, ...props }, ref) => (
  <IconPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden",
      className
    )}
    {...props}
  />
))
Icon.displayName = IconPrimitive.Root.displayName

const IconImage = React.forwardRef<
  React.ElementRef<typeof IconPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof IconPrimitive.Image>
>(({ className, ...props }, ref) => (
  <IconPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
IconImage.displayName = IconPrimitive.Image.displayName

const IconFallback = React.forwardRef<
  React.ElementRef<typeof IconPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof IconPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <IconPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center",
      className
    )}
    {...props}
  />
))
IconFallback.displayName = IconPrimitive.Fallback.displayName

export { Icon, IconImage, IconFallback }
