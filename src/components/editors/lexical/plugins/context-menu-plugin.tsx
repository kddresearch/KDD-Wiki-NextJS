import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, LexicalNode, REDO_COMMAND, SELECTION_CHANGE_COMMAND, UNDO_COMMAND } from "lexical";
import { getNodeBeforeRoot } from "../utils";

// Still no clue what this is for
const LowPriority = 1;

function ContextMenuPlugin({
  ...props
}: React.HTMLProps<HTMLDivElement>
) {
  
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [currentNode, setCurrentNode] = useState<LexicalNode | null>(null);

  const updateCommandBar = useCallback(() => {



  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateCommandBar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateCommandBar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateCommandBar]);

  const getCurrentNode = useCallback(() => {

    editor.update(() => {
      const selection = $getSelection();
      let node;

      if (!selection) {
        return;
      }

      if ($isRangeSelection(selection)) {
        node = selection.focus.getNode();

        node = getNodeBeforeRoot(node);
      }

      if (node === undefined) {
        return;
      }

      setCurrentNode(node);
    })

  }, [editor])

  const onOpenChange = useCallback((isOpen: boolean) => {

    if (!isOpen) {
      return;
    }

    getCurrentNode();

  }, [getCurrentNode]);

  const currentNodeToText = useCallback(() => {
    if (!currentNode) {
      return "";
    }

    return currentNode.getType();
  }, [currentNode]);

  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger {...props}>
        {props.children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">

        {/* Undo Button */}
        <ContextMenuItem
          inset
          disabled={!canUndo}
          onMouseUp={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          Undo
          <ContextMenuShortcut>⌘z</ContextMenuShortcut>
        </ContextMenuItem>

        {/* Redo Button */}
        <ContextMenuItem
          inset
          disabled={!canRedo}
          onMouseUp={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          Redo
          <ContextMenuShortcut>⌘y</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        {/* Styling */}
        <ContextMenuCheckboxItem checked>
          Bold
          <ContextMenuShortcut>⌘B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Italic
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Underline
          <ContextMenuShortcut>⌘U</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>
          Strikethrough
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuCheckboxItem>

        {/* Elements */}
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Insert Link
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Elements</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Insert Header
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Insert Code
            </ContextMenuItem>
            <ContextMenuItem>
              Insert Table
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem>
          {currentNodeToText()}
        </ContextMenuItem>

      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ContextMenuPlugin