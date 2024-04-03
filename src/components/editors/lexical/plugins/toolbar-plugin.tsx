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

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
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
      className="flex bg-white p-1 rounded-t-lg align-middle"
      ref={toolbarRef}
    >
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5"
        aria-label="Undo"
      >
        <i className="format undo" />
        Undo
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="flex border rounded-md p-1 spaced cursor-pointer align-middle"
        aria-label="Redo"
      >
        <i className="format redo" />
        Redo
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 " +
          (isBold ? "bg-[#dfe8fa4d]" : "")
        }
        aria-label="Format Bold"
      >
        <i className="format bold" />
        bold
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 " +
          (isItalic ? "bg-[#dfe8fa4d]" : "")
        }
        aria-label="Format Italics"
      >
        <i className="format italic" />
        italic
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 " +
          (isUnderline ? "bg-[#dfe8fa4d]" : "")
        }
        aria-label="Format Underline"
      >
        <i className="format underline" />
        underline
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5 " +
          (isStrikethrough ? "bg-[#dfe8fa4d]" : "")
        }
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
        strike through
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5"
        aria-label="Left Align"
      >
        <i className="format left-align" />
        left align
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5"
        aria-label="Center Align"
      >
        <i className="format center-align" />
        center align
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="flex border rounded-md p-1 spaced cursor-pointer align-middle mr-0.5"
        aria-label="Right Align"
      >
        <i className="format right-align" />
        right align
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="flex border rounded-md p-1 spaced cursor-pointer align-middle"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
        justify
      </button>{" "}
    </div>
  );
}
