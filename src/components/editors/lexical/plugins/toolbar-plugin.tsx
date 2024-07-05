import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import classNames from "classnames";
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
  return <div className="w-px bg-lightgray mr-0.5" />;
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

  const buttonClasses = classNames(
    "flex",
    "border-0",
    "rounded-md",
    "p-1",
    "spaced",
    "cursor-pointer",
    "align-middle",
    "text-darkergray",
    "mr-0.5",
    "hover:bg-lightgray",
    "disabled:opacity-20",
  );
  
  const boldButtonClasses = classNames(buttonClasses, {
    "bg-[#dfe8fa4d] text-black": isBold
  });
  
  // Specific classes for the Italics button
  const italicButtonClasses = classNames(buttonClasses, {
    "bg-[#dfe8fa4d] text-black": isItalic
  });

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
        className={buttonClasses}
        aria-label="Undo"
      >
        <ArrowCounterclockwise />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={buttonClasses}
        aria-label="Redo"
      >
        <ArrowClockwise />
      </button>
      <Divider />

      {/* Bold Button */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={boldButtonClasses}   
        aria-label="Format Bold"
      >
        <TypeBold />
      </button>

      {/* Italics Button */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={italicButtonClasses}
        aria-label="Format Italics"
      >
        <TypeItalic />
      </button>

      {/* Italics Button */}
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

      {/* Strikethrough Button */}
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
    </div>
  );
}
