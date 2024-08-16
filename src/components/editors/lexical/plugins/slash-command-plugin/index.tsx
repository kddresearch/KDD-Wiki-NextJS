import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { cloneElement, Fragment, LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ENTER_COMMAND, LexicalEditor, TextNode } from "lexical";
// import { fireEvent } from "@testing-library/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import * as Portal from '@radix-ui/react-portal';
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from "@lexical/utils";
import { nodeKeyboardShortcuts, Shortcut } from "../../nodes";
import { $splitNodeContainingQuery } from "../../utils";
import { useSettings } from "../settings-context-plugin";

class ElementCommandOption extends MenuOption {
  name: string;
  constructor(
    name: string,
    options?: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect?: (queryString: string) => void;
    }
  ) {
    super(name);
    this.name = name;
  }
}

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

interface CommandProps {
  open: boolean;
  value: string;
  queryString: string | null;
  anchorElement: HTMLElement | null;
}

function QuickCommand({
  open,
  value,
  queryString,
  anchorElement,
}
: CommandProps
) {
  const [editor] = useLexicalComposerContext();

  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const commandMenuRef = useRef<HTMLDivElement>(null);

  const setPosition = useCallback((anchorElement: HTMLElement) => {
    // Anchor element is a portal
    const x = anchorElement.offsetLeft;
    const y = anchorElement.offsetTop;
    const height = anchorElement.offsetHeight;
    const width = anchorElement.offsetWidth;

    console.log('x:', x, 'y:', y, 'height:', height, 'width:', width);

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
      console.log(anchorElement);
      setPosition(anchorElement);
    }
  }, [anchorElement, setPosition]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (event: KeyboardEvent) => {
          if (commandMenuRef.current) {
            console.log('downArrow consumed yum!!!');

            event.preventDefault();
            event.stopImmediatePropagation();

            const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' }); // TODO: Fix this stupid solution
            console.log('keyboardEvent', commandMenuRef.current);

            commandMenuRef.current?.dispatchEvent(keyboardEvent);
          }
          return true;
        },
        COMMAND_PRIORITY_NORMAL,
      ),

      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        (event: KeyboardEvent) => {
          if (commandMenuRef.current) {
            console.log('upArrow consumed yum!!!');

            event.preventDefault();
            event.stopImmediatePropagation();

            const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }); // TODO: Fix this stupid solution
            commandMenuRef.current?.dispatchEvent(keyboardEvent);
          }

          return true;
        },
        COMMAND_PRIORITY_NORMAL,
      ),

      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent | null) => {
          if (event === null) {
            return false;
          }

          if (commandMenuRef.current) {

            event.preventDefault();
            event.stopImmediatePropagation();

            const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }); // TODO: Fix this stupid solution
            commandMenuRef.current?.dispatchEvent(keyboardEvent);
          }

          return true;
        },
        COMMAND_PRIORITY_NORMAL,
      ),
    );
  });

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
          value={value}
          ref={commandMenuRef}
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
}



export default function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = [new ElementCommandOption("None")];

  const [value, setValue] = useState<string>(' ');

  const onSelectOption = useCallback((
      selectedOption: ElementCommandOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<ElementCommandOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForSlashTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex},
        matchingString
      ) => {
        return (
          <QuickCommand
            open={anchorElementRef.current !== null}
            value={value}
            anchorElement={anchorElementRef.current}
            queryString={matchingString}
          />
        )
      }}
    />
  );
}