import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand } from "lexical";
import { useLayoutEffect } from "react";

export const KEY_LEFT_BRACKET_COMMAND = createCommand<KeyboardEvent>("left-bracket");
export const KEY_RIGHT_BRACKET_COMMAND = createCommand<KeyboardEvent>("right-bracket");

export default function KeyboardCommandsPlugin() {
  
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '[') {
        editor.dispatchCommand(KEY_LEFT_BRACKET_COMMAND, event);
      }

      if (event.key === ']') {
        editor.dispatchCommand(KEY_RIGHT_BRACKET_COMMAND, event);
      }
    };

    return editor.registerRootListener((
      rootElement: null | HTMLElement, prevRootElement: null | HTMLElement
    ) => {
      if (prevRootElement) {
        prevRootElement.removeEventListener('keydown', onKeyDown);
      }

      if (rootElement) {
        rootElement.addEventListener('keydown', onKeyDown);
      }
    })
  }, [editor]);

  return null;
}