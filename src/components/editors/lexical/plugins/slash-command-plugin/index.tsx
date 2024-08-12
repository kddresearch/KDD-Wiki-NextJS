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
import { nodeKeyboardShortcuts } from "../../nodes";
import { $splitNodeContainingQuery } from "../../utils";

class ElementCommandOption extends MenuOption {
  name: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;


  constructor(
    name: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }) {
      super(name);
      this.name = name;
      this.onSelect = options.onSelect.bind(this);
  }
}

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  popoverLocation: { x: number, y: number };
  setPopoverLocation: (anchorElement: HTMLElement) => void;
  commandRef: LegacyRef<HTMLDivElement>;
  queryString: string | null;

  anchorElement: HTMLElement | null;
  editor: LexicalEditor;
  cleanup: (option: ElementCommandOption) => void
  commandIndex: number | null;
  options: ElementCommandOption[];
  setHighlighedIndex: (index: number) => void;
}

function QuickCommand({
  open,
  onOpenChange,
  value,
  onValueChange,
  popoverLocation,
  setPopoverLocation,
  commandRef,
  queryString,
  anchorElement,
  editor,
  cleanup,
  commandIndex,
  options,
  setHighlighedIndex,
}
: CommandProps
) {

  useEffect(() => {
    if (anchorElement) {
      setPopoverLocation(anchorElement);
    }
  }, [anchorElement, setPopoverLocation]);

  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
    >
      <PopoverContent
        className="p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
        style={
          {
            position: 'absolute',
            top: popoverLocation.y,
            left: popoverLocation.x,
          }
        }
      >
       <Command ref={commandRef} tabIndex={-1} value={value} onValueChange={onValueChange}>
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
                    onSelect={() => {
                      console.log('shortcut:', shortcut);
                      
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
                    }}
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
  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0 });

  const results = useMemo(() => ["hello"], []); ;

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new ElementCommandOption(result, {
              onSelect: (queryString: string) => {
                console.log('queryString:', queryString);
              }
            }),
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(' ');
  const commandMenuRef = useRef<HTMLDivElement>(null);

  const setCommandValue = useCallback((value: string) => {
    console.log('setCommandValue:', value);
    setValue(value);
  }, []);

  const onSelectOption = useCallback(
    (
      selectedOption: ElementCommandOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (event: KeyboardEvent) => {
          if (commandMenuRef.current) {
            console.log('downArrow Pressed!!!');

            event.preventDefault();
            event.stopImmediatePropagation();

            const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }); // TODO: Fix this stupid solution
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
            console.log('enter consumed yum!!!');
            console.log('selected item:', value);

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

  const setPosition = useCallback((anchorElement: HTMLElement) => {
    const rect = anchorElement?.getBoundingClientRect();
    const { x, y } = rect ? { x: rect.x, y: rect.y + rect.height } : { x: 0, y: 0 };
    setPopoverLocation({ x, y});

    if (anchorElement) {
      setOpen(true);
    } else {
      setOpen(false);
    }

  }, [])

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
        console.log('selectedIndex:', selectedIndex);
        return (
          <QuickCommand
            open={open}
            onOpenChange={setOpen}
            value={value}
            onValueChange={setCommandValue}
            popoverLocation={popoverLocation}
            setPopoverLocation={setPosition}
            commandRef={commandMenuRef}
            anchorElement={anchorElementRef.current}
            queryString={queryString}
            editor={editor}
            commandIndex={selectedIndex}
            cleanup={selectOptionAndCleanUp}
            options={options}
            setHighlighedIndex={setHighlightedIndex}
          />
        );
      }}
    />
  );
}