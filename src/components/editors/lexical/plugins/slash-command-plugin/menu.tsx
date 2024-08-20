import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  cloneElement,
  ElementRef,
  ComponentPropsWithoutRef,
  forwardRef,
  Fragment,
  LegacyRef,
  useCallback,
  useEffect,
  useState
} from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import * as Portal from '@radix-ui/react-portal';
import {
  Popover,
  PopoverAnchor,
  PopoverContent
} from "@/components/ui/popover";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import {
  nodeKeyboardShortcuts,
  Shortcut
} from "../../nodes";
import { $splitNodeContainingQuery } from "../../utils";
import { useSettings } from "../settings-context-plugin";

interface CommandProps extends ComponentPropsWithoutRef<typeof Command> {
  open: boolean;
  queryString: string | null;
  anchorElement: HTMLElement | null;
  ref?: LegacyRef<HTMLDivElement>;
}

const commandMenu = forwardRef<
  ElementRef<typeof Command>,
  CommandProps
>(({ open, queryString, anchorElement, ...props }, ref) => {
  const [editor] = useLexicalComposerContext();

  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const setPosition = useCallback((anchorElement: HTMLElement) => {
    // Anchor element is a portal
    const x = anchorElement.offsetLeft;
    const y = anchorElement.offsetTop;
    const height = anchorElement.offsetHeight;
    const width = anchorElement.offsetWidth;

    setPopoverLocation({ x, y, height, width });
  }, [])

  const {
    setOption,
    settings: {
      isDebug
    },
  } = useSettings();

  const onSelectCallback = useCallback((shortcut: Shortcut) => {
    editor.update(() => {
      const textNode = $splitNodeContainingQuery({
        leadOffset: 0,
        matchingString: queryString || '',
        replaceableString: `/${queryString}`,
      })
  
      if (!textNode) {
        throw new Error('No textNode found, cannot remove query string');
      }
  
      if (shortcut.command) {
        editor.dispatchCommand(shortcut.command, undefined);
      }
  
      if (textNode) {
        const ElementNode = $getNearestBlockElementAncestorOrThrow(textNode);
        if (ElementNode.getTextContent() === textNode.getTextContent()) {
          ElementNode.remove();
        } else {
          textNode.remove();
        }
      }
    })
  }, [editor, queryString]);

  useEffect(() => {
    if (anchorElement) {
      setPosition(anchorElement);
    }
  }, [anchorElement, setPosition]);


  return (
    <Popover
      open={open}
      onOpenChange={() => {}}
      modal={false}
    >
      <PopoverAnchor asChild>
        <Portal.Root asChild>
          <div
            id="slash-command-anchor"
            className={`absolute pointer-events-none ${isDebug ? 'opacity-50 bg-purple ' : ''}`}
            style={
              {
                height: popoverLocation.height,
                width: popoverLocation.width,
                top: popoverLocation.y,
                left: popoverLocation.x,
              }
            }
          />
        </Portal.Root>
      </PopoverAnchor>

      <PopoverContent
        className="p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
        align="start"
      >
        <Command
          tabIndex={-1}
          ref={ref}
          {...props}
        >
          <CommandInput value={queryString || ''} hideInput={true} />
          <CommandList>
            <CommandEmpty>No elements found</CommandEmpty>
            {nodeKeyboardShortcuts.map((group, index) => (
              <Fragment key={index}>
                <CommandGroup
                  heading={group.category}
                >
                  {group.shortcuts.map((shortcut, index) => (
                    <CommandItem
                      keywords={shortcut.keywords}
                      key={index}
                      onSelect={() => onSelectCallback(shortcut) }
                    >
                      {cloneElement(shortcut.icon, { className: 'mr-2 h-4 w-4 ' + shortcut.icon.props.className })}
                      <span>{shortcut.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {index < nodeKeyboardShortcuts.length - 1 && <CommandSeparator key={index * 2}/>}
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

commandMenu.displayName = 'CommandMenu';

export {
  commandMenu as CommandMenu,
}