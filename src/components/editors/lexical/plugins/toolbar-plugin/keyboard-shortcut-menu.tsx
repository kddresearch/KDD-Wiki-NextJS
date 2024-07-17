import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { type DialogProps } from "@radix-ui/react-dialog"

interface CommandDialogProps extends DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { Heading1Icon, Heading2Icon, Heading3Icon, Link } from "lucide-react"
import React from "react"

function KeyboardShortcutMenu({
  ...props
}: CommandDialogProps
) {

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const open = !props.open;
        props.onOpenChange(open);
      }
    }
 
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog {...props} >
      <CommandInput placeholder="Search for a element..." />
      <CommandList>
        <CommandEmpty>No elements found</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Heading1Icon className="mr-2 h-4 w-4" />
            <span>Heading 1</span>
            <CommandShortcut>(Largest) #</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Heading2Icon className="mr-2 h-4 w-4" />
            <span>Heading 2</span>
            <CommandShortcut>##</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Heading3Icon className="mr-2 h-4 w-4" />
            <span>Heading 3</span>
            <CommandShortcut>(Smallest) ###</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Formatting">
          <CommandItem>
            <Link className="mr-2 h-4 w-4" />
            <span>Link</span>
            <CommandShortcut>[Title](https://url.com)</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default KeyboardShortcutMenu;
