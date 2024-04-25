import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { ArrowClockwise, ArrowCounterclockwise, Justify, TextCenter, TextLeft, TextRight, TypeBold, TypeItalic, TypeStrikethrough, TypeUnderline } from "react-bootstrap-icons";

const LowPriority = 1;

function Divider() {
  return <div className="w-px bg-lightgray mr-1" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
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
  }, [editor, updateToolbar]);

  return (
    <div
      className="flex bg-white mx-1 py-1 rounded-t-lg align-middle text-darkgray border-b border-gray"
      ref={toolbarRef}
    >
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="flex border-0 rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray disabled:opacity-20"
        aria-label="Undo"
      >
        <ArrowCounterclockwise />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="flex border-0  rounded-md p-1 spaced cursor-pointer align-middle hover:bg-lightgray disabled:opacity-20"
        aria-label="Redo"
      >
        <ArrowClockwise />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "flex border-0  rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray " +
          (isBold ? "bg-[#dfe8fa4d] text-black" : "")
        }
        aria-label="Format Bold"
      >
        <TypeBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "flex border-0  rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray " +
          (isItalic ? "bg-[#dfe8fa4d] text-black" : "")
        }
        aria-label="Format Italics"
      >
        <TypeItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "flex border-0  rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray " +
          (isUnderline ? "bg-[#dfe8fa4d] text-black" : "")
        }
        aria-label="Format Underline"
      >
        <TypeUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "flex border-0 rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray " +
          (isStrikethrough ? "bg-[#dfe8fa4d] text-black" : "")
        }
        aria-label="Format Strikethrough"
      >
        <TypeStrikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="flex border-0  rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray"
        aria-label="Left Align"
      >
        <TextLeft />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="flex border-0  rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray"
        aria-label="Center Align"
      >
        <TextCenter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="flex border-0  rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 hover:bg-lightgray"
        aria-label="Right Align"
      >
        <TextRight />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="flex border-0  rounded-md p-1 spaced cursor-pointer align-middle hover:bg-lightgray"
        aria-label="Justify Align"
      >
        <Justify />
      </button>{" "}
    </div>
  );
}
