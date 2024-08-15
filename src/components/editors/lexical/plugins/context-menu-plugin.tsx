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
import { useCallback, useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  LexicalNode,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $isTextNode,
  CUT_COMMAND,
  COPY_COMMAND,
  PASTE_COMMAND,
  RangeSelection,
  $createRangeSelection,
  $setSelection
} from "lexical";
import { getNodeBeforeRoot } from "../utils";
import { $isCodeNode } from "@lexical/code";
import LinkDialog from "./dialog/link";
import {
  getBoldStyling,
  getElementsDisabled,
  getItalicStyling,
  getLinkStyling,
  getStrikethroughStyling,
} from "../utils/styles";
import { useToast } from "@/components/ui/use-toast";
import { Clipboard, ClipboardType, Copy, Scissors } from "lucide-react";
import { getWord, isWordMisspelled, spellcheckIsEnabledOnSelection } from "../utils/spellcheck";

const LowPriority = 1;

function ContextMenuPlugin({
  spellcheck,
  ...props
}: React.HTMLProps<HTMLDivElement> & { spellcheck: boolean}
) {
  
  const [editor] = useLexicalComposerContext();
  const { toast } = useToast();
  const [disabled, setDisabled] = useState(false);

  const [canCut, setCanCut] = useState(false);
  const [canCopy, setCanCopy] = useState(false);

  // Bold
  const [isBold, setIsBold] = useState(false);
  const [isBoldDisabled, setIsBoldDisabled] = useState(false);
  // Italic
  const [isItalic, setIsItalic] = useState(false);
  const [isItalicDisabled, setIsItalicDisabled] = useState(false);
  // Strikethrough
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isStrikethroughDisabled, setIsStrikethroughDisabled] = useState(false);
  // Link
  const [isLink, setIsLink] = useState(false);
  const [isLinkDisabled, setIsLinkDisabled] = useState(false);
  // Elements
  const [isElementsDisabled, setIsElementsDisabled] = useState(false);

  // Selection
  const [currentSelection, setCurrentSelection] = useState<RangeSelection | undefined>(undefined);

  const [currentNode, setCurrentNode] = useState<LexicalNode | undefined>(undefined);

  // Portal Container
  const [portalContainer, setPortalContainer] = useState<HTMLElement | undefined>(undefined);

  const updateCommandBar = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!lexicalSelection) {
      return;
    }

    if (!$isRangeSelection(lexicalSelection)) {
      return;
    }

    if (spellcheck && spellcheckIsEnabledOnSelection(lexicalSelection, editor)) { 
      setDisabled(false);
      const word = getWord(lexicalSelection, editor);
  
      if (word) {
        // if word is all caps, don't check spelling
        if (word === word.toUpperCase()) {
          return;
        }
  
        isWordMisspelled(word).then((result) => {
          if (result) {
            // console.log("misspelled word:", word);
            setDisabled(true);
          }
        });
      }
    }

    if (lexicalSelection.isCollapsed()) {
      setCanCut(false);
      setCanCopy(false);
    } else {
      setCanCut(true);
      setCanCopy(true);
    }

    const boldStyling = getBoldStyling(lexicalSelection);
    setIsBold(boldStyling.isBold);
    setIsBoldDisabled(boldStyling.isDisabled);

    const italicStyling = getItalicStyling(lexicalSelection);
    setIsItalic(italicStyling.isItalic);
    setIsItalicDisabled(italicStyling.isDisabled);

    const strikethroughStyling = getStrikethroughStyling(lexicalSelection);
    setIsStrikethrough(strikethroughStyling.isStrikethrough);
    setIsStrikethroughDisabled(strikethroughStyling.isDisabled);

    const linkStyling = getLinkStyling(lexicalSelection);
    setIsLink(linkStyling.isLink);
    setIsLinkDisabled(linkStyling.isDisabled);

    const elementsStyling = getElementsDisabled(lexicalSelection);
    setIsElementsDisabled(elementsStyling.isDisabled);
  }, [editor, spellcheck]);

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
          console.log("selection change");
          updateCommandBar();
          return false;
        },
        LowPriority,
      )
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

  const saveSelection = useCallback(() => {
    editor.update(() => {
      const lexicalSelection = $getSelection();

      if (!$isRangeSelection(lexicalSelection)) {
        return;
      }

      setCurrentSelection(lexicalSelection);
    });
  }, [editor]);


  const resstoreSelection = useCallback(() => {
    if (currentSelection) {
      editor.update(() => {
        $setSelection(currentSelection);
      });
    }
  }, [currentSelection, editor]);

  const onOpenChange = useCallback((isOpen: boolean) => {
    getCurrentNode();
  }, [getCurrentNode]);

  const currentNodeToText = useCallback(() => {
    if (!currentNode) {
      return "";
    }

    return currentNode.getType();
  }, [currentNode]);

  return (
    <ContextMenu onOpenChange={onOpenChange} modal={false}>
      <ContextMenuTrigger {...props} disabled={disabled} asChild>
        {props.children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64" portalContainer={portalContainer ?? undefined}>

        {/* Copy Button */}
        <ContextMenuItem
          disabled={!canCopy}
          onClick={() => {
            editor.dispatchCommand(COPY_COMMAND, null);
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
          <ContextMenuShortcut>⌘c</ContextMenuShortcut>
        </ContextMenuItem>

        {/* Cut Button */}
        <ContextMenuItem
          disabled={!canCut}
          onClick={() => {
            editor.dispatchCommand(CUT_COMMAND, null);
          }}
        >
          <Scissors className="h-4 w-4 mr-2" />
          Cut
          <ContextMenuShortcut>⌘x</ContextMenuShortcut>
        </ContextMenuItem>

        {/* TODO: Implement global can paste */}

        {/* Paste Button */}
        <ContextMenuItem
          onClick={async () => {

            const permission = await navigator.permissions.query({
              // @ts-expect-error These types are incorrect.
              name: 'clipboard-read',
            });

            if (permission.state === 'denied') {
              toast({
                title: 'Permission Denied',
                description: 'Unable to read from the clipboard',
              });
              return;
            }

            navigator.clipboard.read().then(async function (...args) {
              const data = new DataTransfer();

              const items = await navigator.clipboard.read();
              const item = items[0];

              for (const type of item.types) {
                const dataString = await (await item.getType(type)).text();
                data.setData(type, dataString);
              }

              const event = new ClipboardEvent('paste', {
                clipboardData: data,
              });

              editor.dispatchCommand(PASTE_COMMAND, event);
            })
          }}
        >
          <ClipboardType className="h-4 w-4 mr-2" />
          Paste
          <ContextMenuShortcut>⌘v</ContextMenuShortcut>
        </ContextMenuItem>

        {/* Paste Without Formatting Button */}
        <ContextMenuItem
          onClick={async () => {

            const permission = await navigator.permissions.query({
              // @ts-expect-error These types are incorrect.
              name: 'clipboard-read',
            });

            if (permission.state === 'denied') {
              toast({
                title: 'Permission Denied',
                description: 'Unable to read from the clipboard',
              });
              return;
            }

            navigator.clipboard.read().then(async function (...args) {
              const data = new DataTransfer();
              const items = await navigator.clipboard.readText();
              data.setData('text/plain', items);
  
              const event = new ClipboardEvent('paste', {
                clipboardData: data,
              });
              editor.dispatchCommand(PASTE_COMMAND, event);
            });
          }}
        >
          <Clipboard className="h-4 w-4 mr-2" />
          Paste Without Formatting
          <ContextMenuShortcut>⇧⌘v</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />
        
        {/* Styling */}
        <ContextMenuCheckboxItem
          checked={isBold}
          disabled={isBoldDisabled}
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
          disabled={isItalicDisabled}
          persistMenu={true}
          onCheckedChange={(checked) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        >
          Italic
          <ContextMenuShortcut>⌘I</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={isStrikethrough}
          disabled={isStrikethroughDisabled}
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

        {isLink ? (
          <ContextMenuItem inset disabled={isLinkDisabled}>
            Edit Link
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        ) : (
          <ContextMenuItem inset disabled={isLinkDisabled}>
            Insert Link
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        )}

        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
            More Elements
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem disabled={isElementsDisabled}>
              Insert Header
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled={isElementsDisabled}>
              Insert Code
            </ContextMenuItem>
            <ContextMenuItem disabled={isElementsDisabled}>
              Insert Table
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuLabel>
          {currentNodeToText()}
        </ContextMenuLabel>

      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ContextMenuPlugin