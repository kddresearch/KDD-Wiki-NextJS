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
import {
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { ArrowClockwise, ArrowCounterclockwise, Justify, Link, TextCenter, TextLeft, TextRight, TypeBold, TypeItalic, TypeStrikethrough, TypeUnderline } from "react-bootstrap-icons";
import { getSelectedNode, sanitizeURL } from "../utils";

// No clue what this is for
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

  // Blocks
  const [isLink, setIsLink] = useState(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, []);

  const insertLink = useCallback(() => {

    console.log("Inserting link");

    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeURL("https://www.k-state.edu"),
      )
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(
        TOGGLE_LINK_COMMAND, 
        null
      );
    }}, [editor, isLink]);

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
    "rounded-lg",
    "p-2",
    "spaced",
    "cursor-pointer",
    "align-middle",
    "text-darkergray",
    "mr-0.5",
    "hover:bg-[#EAE0F5]",
    "disabled:opacity-20",
  );

  const buttonActive = classNames(
    "bg-[#F5F0FA]",
    "text-[#263238]",
  );
  
  const boldButtonClasses = classNames(buttonClasses, {
    [buttonActive]: isBold,
    "text-darkergray": !isBold,
  });

  const italicButtonClasses = classNames(buttonClasses, {
    [buttonActive]: isItalic,
    "text-darkergray": !isItalic,
  });

  const underlineButtonClasses = classNames(buttonClasses, {
    [buttonActive]: isUnderline,
    "text-darkergray": !isUnderline
  });

  const strikethroughButtonClasses = classNames(buttonClasses, {
    [buttonActive]: isStrikethrough,
    "text-darkergray": !isStrikethrough
  });

  return (
    <div
      className="flex bg-white mx-1 py-1 rounded-t-lg align-middle text-darkgray border-b border-gray"
      ref={toolbarRef}
    >

      {/* Undo Button */}
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

      {/* Redo Button */}
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

      {/* Underline Button */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={underlineButtonClasses}
        aria-label="Format Underline"
      >
        <TypeUnderline />
      </button>

      {/* Strikethrough Button */}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={strikethroughButtonClasses}
        aria-label="Format Strikethrough"
      >
        <TypeStrikethrough />
      </button>

      {/* Insert Link Button */}
      <button
        onClick={insertLink}
        className={buttonClasses}
        aria-label="Insert Link"
      >
        <Link />
      </button>
    </div>
  );
}
