import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ENTER_COMMAND, TextNode } from "lexical";
import {
  Simulate
} from "react-dom/test-utils";
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
import { mergeRegister } from "@lexical/utils";

class ElementCommandOption extends MenuOption {
  name: string;
  picture: JSX.Element;

  constructor(name: string, picture: JSX.Element) {
    super(name);
    this.name = name;
    this.picture = picture;
  }
}

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

function onSelectOption(option: ElementCommandOption, textNodeContainingQuery: TextNode | null, closeMenu: () => void, matchingString: string) {
  console.log('Selected option:', option);
}



export default function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0 });

  const results = useMemo(() => ["hello", "world", "foo", "bar", "baz"], []); ;

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new ElementCommandOption(result, <i className="icon user" />),
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
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
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState<string>(' ');
        const commandMenuRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
          const anchorElement = anchorElementRef.current;
          const rect = anchorElement?.getBoundingClientRect();
          const { x, y } = rect ? { x: rect.x, y: rect.y + rect.height } : { x: 0, y: 0 };
          setPopoverLocation({ x, y});

          if (anchorElementRef.current && options.length) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }, []);

        const setCommandValue = useCallback((value: string) => {
          console.log('setCommandValue:', value);
          setValue(value);
        }, []);

        useEffect(() => {
          return mergeRegister(
            editor.registerCommand<KeyboardEvent>(
              KEY_ARROW_DOWN_COMMAND,
              (payload) => {
                const event = payload;
                if (options !== null && options.length && selectedIndex !== null) {
                  console.log('downArrow Pressed!!!');
                  event.preventDefault();
                  event.stopImmediatePropagation();

                  // commandMenuRef.current?.focus();

                  if (commandMenuRef.current) {
                    Simulate.keyDown(commandMenuRef.current, { key: 'ArrowDown' }); // TODO: Fix this stupid solution
                    // commandMenuRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
                    console.log('commandMenuRef:', commandMenuRef.current);
                  }
                }
                return true;
              },
              COMMAND_PRIORITY_NORMAL,
            ),

            editor.registerCommand<KeyboardEvent>(
              KEY_ARROW_UP_COMMAND,
              (payload) => {
                const event = payload;
                if (options !== null && options.length && selectedIndex !== null) {
                  console.log('upArrow consumed yum!!!');
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  if (commandMenuRef.current) {
                    Simulate.keyDown(commandMenuRef.current, { key: 'ArrowUp' }); // TODO: Fix this stupid solution
                    // commandMenuRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
                    console.log('commandMenuRef:', commandMenuRef.current);
                  }
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

                if (options !== null && options.length && selectedIndex !== null) {
                  console.log('enter consumed yum!!!');
                  console.log('selected item:', value);

                  if (commandMenuRef.current) {
                    Simulate.keyDown(commandMenuRef.current, { key: 'Enter' }); // TODO: Fix this stupid solution
                    // commandMenuRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
                    console.log('commandMenuRef:', commandMenuRef.current);
                  }

                  event.preventDefault();
                  event.stopImmediatePropagation();
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
            onOpenChange={setOpen}
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
             <Command ref={commandMenuRef} tabIndex={-1} value={value} onValueChange={setCommandValue}>
              <CommandInput value={queryString || ''} hideInput={true} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>Heading</CommandItem>
                  <CommandItem>Quote</CommandItem>
                  <CommandItem>hello-world</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>Profile</CommandItem>
                  <CommandItem>Billing</CommandItem>
                  <CommandItem>Settings</CommandItem>
                </CommandGroup>
              </CommandList>
             </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}