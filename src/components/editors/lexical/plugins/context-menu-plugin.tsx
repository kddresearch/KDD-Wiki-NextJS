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
} from "@/components/ui/context-menu";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import {
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  TextNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $isTextNode
} from "lexical";
import { getNodeBeforeRoot } from "../utils";
import { $isCodeNode } from "@lexical/code";
import LinkDialog from "./dialog/link";

// Still no clue what this is for
const LowPriority = 1;

function ContextMenuPlugin({
  ...props
}: React.HTMLProps<HTMLDivElement>
) {
  
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [stylingDisabled, setStylingDisabled] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | undefined>(undefined);

  const [currentNode, setCurrentNode] = useState<LexicalNode | undefined>(undefined);

  const updateCommandBar = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!lexicalSelection) {
      return;
    }

    if ($isRangeSelection(lexicalSelection)) {
      setIsBold(lexicalSelection.hasFormat("bold"));
      setIsItalic(lexicalSelection.hasFormat("italic"));
      setIsUnderline(lexicalSelection.hasFormat("underline"));
      setIsStrikethrough(lexicalSelection.hasFormat("strikethrough"));
    }

    const isCode = lexicalSelection.getNodes().some((node) => {
      const topNode = getNodeBeforeRoot(node);
      if ($isCodeNode(topNode)) {
        return true;
      }
    });

    setStylingDisabled(isCode);
  }, []);

  const handleInsertLink = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection) {
        return;
      }

      if ($isRangeSelection(selection)) {
        // get text from selection
        const text = selection.getNodes().map((node) => {
          if ($isCodeNode(node)) {
            return "";
          }

          if ($isTextNode(node)) {
            return node.getTextContent();
          }
        }).join("");

        setSelectedText(text);

        console.log("selectedText:", text);
      }
    });
    setIsLinkDialogOpen(true);
  };

  const handleLinkDialogClose = () => {
    setIsLinkDialogOpen(false);
  };

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
          persistMenu={true}
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
          persistMenu={true}
          onMouseUp={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          Redo
          <ContextMenuShortcut>⌘y</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        {/* Styling */}
        <ContextMenuCheckboxItem
          checked={isBold}
          disabled={stylingDisabled}
          persistMenu={true}
          onCheckedChange={(checked) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        >
          Bold
          <ContextMenuShortcut>⌘B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={isItalic}
          disabled={stylingDisabled}
          persistMenu={true}
          onCheckedChange={(checked) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        >
          Italic
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={isUnderline}
          disabled={stylingDisabled}
          persistMenu={true}
          onCheckedChange={(checked) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
        >
          Underline
          <ContextMenuShortcut>⌘U</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={isStrikethrough}
          disabled={stylingDisabled}
          persistMenu={true}
          onCheckedChange={(checked) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
        >
          Strikethrough
          <ContextMenuShortcut>⌘S</ContextMenuShortcut>
        </ContextMenuCheckboxItem>

        {/* Elements */}
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={handleInsertLink}>
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
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem>
          {currentNodeToText()}
        </ContextMenuItem>

      </ContextMenuContent>
      <LinkDialog
        open={isLinkDialogOpen}
        onOpenChange={handleLinkDialogClose}
        defaultText={selectedText}
        // You can pass additional props to the LinkDialog component if needed
      />
    </ContextMenu>
  )
}

export default ContextMenuPlugin