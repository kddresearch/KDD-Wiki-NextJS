import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { set } from "lodash-es";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSelectedNode } from "../utils";

// Still no clue what this is for
const LowPriority = 1;

const textboxId = "lexical-text-editable";

function SelectionToolbarPlugin() {

  const [editor] = useLexicalComposerContext();

  const [selection, setSelection] = useState<{x: number, y: number} | null>(null);

  // selection states
  const [isValidSelection, setIsValidSelection] = useState(false);
  const [isWithinTextbox, setIsWithinTextbox] = useState(false);
  const [show, setShow] = useState(false);
  
  // format states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const getValue = () => {
    const values = [];
    if (isBold) values.push("bold");
    if (isItalic) values.push("italic");
    if (isUnderline) values.push("underline");
    if (isStrikethrough) values.push("strikethrough");
    return values;
  };

  const selectionToolbarRef = useRef<HTMLDivElement | null>(null);

  
  const setMenuPosition = useCallback(() => {
    const nativeSelection = window.getSelection();
    const textbox = document.getElementById(textboxId);
    
    if (textbox === null) {
      throw new Error("Element not found, the selection toolbar plugin requires 'lexical-text-editable' id to be present on the content editable element");
    }

    if (nativeSelection === null) {
      return;
    }

    const textboxRect = textbox.getBoundingClientRect();

    const range = nativeSelection.getRangeAt(0);

    const rect = range.getBoundingClientRect();
    const x = rect.left - textboxRect.left;
    const y = rect.bottom - textboxRect.top;

    setSelection({ x, y });
  }, []);

  const updateShow = useCallback(() => {
    const show = isValidSelection && isWithinTextbox;

    console.log("isWithinTextbox", isWithinTextbox);
    console.log("isValidSelection", isValidSelection);
    console.log("show", show);

    if (show) {
      setMenuPosition();
    }

    setShow(show);
  }, [isValidSelection, isWithinTextbox, setMenuPosition]);
4
  useEffect(() => {
    updateShow();
  }, [isValidSelection, isWithinTextbox, updateShow]);


  const onPopoverOpenChange = useCallback((event: boolean) => {

    if (event) console.log("opening Menu");
    else console.log("closing Menu");

    updateShow();
    setShow(event);

  }, [updateShow]);

  const updateSelectionToolbarState = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (lexicalSelection === null) {
      console.log("invalidSelection: selection is null");
      setIsValidSelection(false);
      return;
    }
    if (!$isRangeSelection(lexicalSelection)) {
      console.log("invalidSelection: selection is not range selection");
      setIsValidSelection(false);
      return;
    }

    if (lexicalSelection.anchor.offset === lexicalSelection.focus.offset) {
      console.log("invalidSelection: selection range is 0 offset");
      setIsValidSelection(false);
      console.log("selection", isValidSelection);
      return;
    }

    // Update text format
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }

      // Update text format
      setIsBold(lexicalSelection.hasFormat('bold'));
      setIsItalic(lexicalSelection.hasFormat('italic'));
      setIsUnderline(lexicalSelection.hasFormat('underline'));
      setIsStrikethrough(lexicalSelection.hasFormat('strikethrough'));
      // setIsSubscript(lexicalSelection.hasFormat('subscript'));
      // setIsSuperscript(lexicalSelection.hasFormat('superscript'));
      // setIsCode(lexicalSelection.hasFormat('code'));
    })

    setIsValidSelection(true);

  }, [editor, isValidSelection, setIsValidSelection]);

  function mouseUpListener(e: MouseEvent) {

    const nativeSelection = window.getSelection();
    const textbox = document.getElementById(textboxId);

    if (textbox === null) {
      throw new Error("Element not found, the selection toolbar plugin requires 'lexical-text-editable' id to be present on the content editable element");
    }

    if (nativeSelection === null) {
      return;
    }

    if (nativeSelection.rangeCount) {
      const range = nativeSelection.getRangeAt(0);
      const textboxRange = document.createRange();
      textboxRange.selectNodeContents(textbox);

      setIsWithinTextbox(textboxRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 &&
        textboxRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0);
    }

    updateShow();
  }

  useEffect(() => {
    document.addEventListener("mouseup", mouseUpListener);
    // document.addEventListener("mousemove", mouseMoveListener);

    return () => {
      document.removeEventListener("mouseup", mouseUpListener);
      // document.removeEventListener("mousemove", mouseMoveListener);
    }
  })

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateSelectionToolbarState();
          updateShow();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateSelectionToolbarState();
          updateShow();

          return false;
        },
        LowPriority,
      )
    );
  }, [editor, updateSelectionToolbarState, updateShow]);

  const xOffset = selection?.x;
  const yOffset = selection?.y;

  return (
    <Popover open={show} onOpenChange={onPopoverOpenChange} >
      <PopoverAnchor asChild>
        <div
          id="selection-toolbar-anchor"
          className="absolute data-[show=true]:block hidden"
          data-show={show}
          style={{
            left: xOffset,
            top: yOffset
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        className="p-0 w-auto"
      >        
        <ToggleGroup 
          size={"sm"} 
          type="multiple"
          value={getValue()}
          className="m-1"
        >
          <ToggleGroupItem 
            value="bold"
            aria-label="Toggle bold"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="italic" 
            aria-label="Toggle italic"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="underline" 
            aria-label="Toggle underline"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
          >
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  )
}

export default SelectionToolbarPlugin;