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
import { cloneElement } from 'react';

interface CommandDialogProps extends DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Link
} from "lucide-react"
import React from "react"

enum Category {
  SUGGESTIONS = "Suggestions",
  FORMATTING = "Formatting",
}

import { nodeKeyboardShortcuts } from "../../nodes";

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
  })

  function onselect() {
    props.onOpenChange(false);
  }

  return (
    <CommandDialog DialogTitle="Keyboard Shortcuts" {...props} >
      <CommandInput placeholder="Search for a element..." />
      <CommandList>
        <CommandEmpty>No elements found</CommandEmpty>
          {nodeKeyboardShortcuts.map((group, index) => (
            <CommandGroup key={index} heading={group.category}>
              {group.shortcuts.map((shortcut, index) => (
                <CommandItem key={index}>
                  {cloneElement(shortcut.icon, { className: 'mr-2 h-4 w-4' })}
                  <span>{shortcut.name}</span>
                  <CommandShortcut>{shortcut.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
    </CommandDialog>
  );
}

export default KeyboardShortcutMenu;
