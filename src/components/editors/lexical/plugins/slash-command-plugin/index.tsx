import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { cloneElement, Fragment, LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { COMMAND_PRIORITY_LOW, COMMAND_PRIORITY_NORMAL, COMMAND_PRIORITY_HIGH, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ENTER_COMMAND, LexicalEditor, TextNode } from "lexical";
// import { fireEvent } from "@testing-library/react";
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from "@lexical/utils";

import { CommandMenu } from "./menu";
import { Command } from "@/components/ui/command";

class ElementCommandOption extends MenuOption {
  name: string;
  constructor(
    name: string
  ) {
    super(name);
    this.name = name;
  }
}

export default function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const commandMenuRef = useRef<React.ElementRef<typeof Command>>(null);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = [new ElementCommandOption("None"), new ElementCommandOption("None22")];

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

  const handleKeyArrowDown = useCallback((event: KeyboardEvent) => {
    if (commandMenuRef.current) {
      console.log('downArrow consumed yum!!!');

      const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }); // TODO: Fix this stupid solution
      commandMenuRef.current?.dispatchEvent(keyboardEvent);

      event.preventDefault();
      event.stopImmediatePropagation();
    }

    return true;
  }, [commandMenuRef]);

  const handleKeyArrowUp = useCallback((event: KeyboardEvent) => {
    if (commandMenuRef.current) {
      console.log('upArrow consumed yum!!!');

      const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }); // TODO: Fix this stupid solution
      commandMenuRef.current?.dispatchEvent(keyboardEvent);

      event.preventDefault();
      event.stopImmediatePropagation();
    }

    return true;
  }, [commandMenuRef]);

  const handleKeyEnter = useCallback((event: KeyboardEvent) => {
    if (commandMenuRef.current) {
      console.log('enter consumed yum!!!');

      const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }); // TODO: Fix this stupid solution
      commandMenuRef.current?.dispatchEvent(keyboardEvent);

      event.preventDefault();
      event.stopImmediatePropagation();
    }

    return true;
  }, [commandMenuRef]);

  // onMount

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        handleKeyArrowDown,
        COMMAND_PRIORITY_HIGH,
      ),

      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        handleKeyArrowUp,
        COMMAND_PRIORITY_HIGH,
      ),

      editor.registerCommand(
        KEY_ENTER_COMMAND,
        handleKeyEnter,
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);

  return (
    <LexicalTypeaheadMenuPlugin<ElementCommandOption>
      onQueryChange={() => {}}
      onSelectOption={onSelectOption}
      triggerFn={checkForSlashTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex},
        matchingString
      ) => {
        return (
          <CommandMenu
            open={anchorElementRef.current !== null}
            anchorElement={anchorElementRef.current}
            queryString={matchingString}
            ref={commandMenuRef}
          />
        ) 
      }}
    />
  );
}