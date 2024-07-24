import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getNodeBeforeRoot, getSelectedNode } from "../utils";

// Still no clue what this is for
const LowPriority = 1;

const textboxId = "lexical-text-editable";

function SelectionToolbarPlugin() {

  const [editor] = useLexicalComposerContext();

  const [selection, setSelection] = useState<{x: number, y: number} | null>(null);

  // selection states
  const [isVisible, setIsVisible] = useState(false);

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

    console.log("setMenuPosition", x, y);

    setSelection({ x, y });
  }, []);

  const updateMenuVisibility = useCallback((isValidSelection: boolean, isValidSelectionBoundary: boolean) => {
    const show = isValidSelection && isValidSelectionBoundary;

    console.log("isValidSelectionBoundary", isValidSelectionBoundary);
    console.log("isValidSelection", isValidSelection);
    console.log("show", show);

    if (show) {
      setMenuPosition();
    }

    setIsVisible(show);
  }, [setMenuPosition]);

  const onPopoverOpenChange = useCallback((event: boolean) => {

    setIsVisible(true); // Always show the toolbar

    // if (!event) return setIsVisible(false);
  }, []);

  // Syncronous function to wait for composition to finish
  const waitForComposition = useCallback(() => {
    const checkComposition = () => {
      editor.getEditorState().read(() => {
        const isComposing = editor.isComposing();
        if (!isComposing) {
          console.log("Editor is finished composing");
          return isComposing;
        } else {
          setTimeout(checkComposition, 10); // Check again after 10ms
        }
      });
    };
    checkComposition();
  }, [editor]);

  const updateSelectionValidity = useCallback(() => {

    const completed = waitForComposition();

    const lexicalSelection = $getSelection();

    if (lexicalSelection === null) {
      console.log("invalidSelection: selection is null");
      return false;
    }
    if (!$isRangeSelection(lexicalSelection)) {
      console.log("invalidSelection: selection is not range selection");
      return false;
    }
    if (lexicalSelection.anchor.offset === lexicalSelection.focus.offset) {
      console.log("invalidSelection: selection range is 0 offset");
      return false;
    }

    return true;
  }, [waitForComposition]);

  const checkSelectiongBoundary = useCallback(() => {
    const nativeSelection = window.getSelection();
    const textbox = document.getElementById(textboxId);

    if (textbox === null) {
      return false;
      throw new Error("Element not found, the selection toolbar plugin requires 'lexical-text-editable' id to be present on the content editable element");
    }

    if (nativeSelection === null) {
      return false;
    }

    if (!nativeSelection.rangeCount) {
      return false;
    }
    
    const range = nativeSelection.getRangeAt(0);
    const textboxRange = document.createRange();
    textboxRange.selectNodeContents(textbox);

    const result = textboxRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 &&
      textboxRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0;

    return result;
  }, []);

  const handleSelectionChange = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (lexicalSelection === null) {
      return false;
    }
    if (!$isRangeSelection(lexicalSelection)) {
      return false;
    }

    // Update text format
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return false;
      }

      // Update text format
      setIsBold(lexicalSelection.hasFormat('bold'));
      setIsItalic(lexicalSelection.hasFormat('italic'));
      setIsUnderline(lexicalSelection.hasFormat('underline'));
      setIsStrikethrough(lexicalSelection.hasFormat('strikethrough'));
      // setIsSubscript(lexicalSelection.hasFormat('subscript'));
      // setIsSuperscript(lexicalSelection.hasFormat('superscript'));
      // setIsCode(lexicalSelection.hasFormat('code'));
    });

    const isCode = lexicalSelection.getNodes().some((node) => {

      console.log("node", node);

      const topNode = getNodeBeforeRoot(node);
      if ($isCodeNode(topNode)) {
        return true;
      }
    });

    const result = updateSelectionValidity();
    const isValidSelection = result && !isCode;

    if (!isValidSelection) {
      setIsVisible(false);
    }


    return isValidSelection;
  }, [editor, updateSelectionValidity]);

  const handleMouseUp = useCallback((e: MouseEvent) => {

    if (e.button === 2) {
      setIsVisible(false);
      return;
    }

    if (e.button !== 0) {
      return;
    }

    // wait .5 seconds for the composition to finish
    waitForComposition();

    console.log("Mouse Released");

    const boundaryResult = checkSelectiongBoundary();
    console.log("boundaryResult", boundaryResult);

    editor.update(async () => {
      const validSelectionResult = await handleSelectionChange();
      console.log("validSelectionResult", validSelectionResult);
      updateMenuVisibility(validSelectionResult, boundaryResult);
    });

  }, [editor, checkSelectiongBoundary, updateMenuVisibility, handleSelectionChange, waitForComposition]);


  // Register Hooks
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    }
  });

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          handleSelectionChange();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          handleSelectionChange();
          return false;
        },
        LowPriority,
      )
    );
  }, [editor, handleSelectionChange]);

  const xOffset = selection?.x;
  const yOffset = selection?.y;

  return (
    <Popover open={isVisible} onOpenChange={onPopoverOpenChange} >
      <PopoverAnchor asChild>
        <div
          id="selection-toolbar-anchor"
          className="absolute data-[show=true]:block hidden"
          data-show={isVisible}
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