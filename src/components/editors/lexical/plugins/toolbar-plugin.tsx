"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND,
  $createTextNode
} from "lexical";
import {
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { getNodeBeforeRoot, getSelectedNode } from "../utils";
import { $isCodeNode } from '@lexical/code';

import { Bold, Italic, Underline, Strikethrough, Undo, Redo, Code, Link, User, CreditCard, Settings, Keyboard, Users, UserPlus, Mail, MessageSquare, PlusCircle, Plus, Github, LifeBuoy, Cloud, LogOut, Calendar, Smile, Calculator, Heading1Icon, Heading2Icon, Heading3Icon, Heading, Bug, PictureInPicture2, Info } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import KeyboardShortcutMenu from "./toolbar-plugin/keyboard-shortcut-menu";
import InsertElementDropdown from "./toolbar-plugin/insert-dropdown";
import CodeDropdown from "./toolbar-plugin/code-dropdown";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSettings } from "./settings-context-plugin";
import AboutDialog from "./dialog/about";
import {
  getBoldStyling,
  getItalicStyling,
  getStrikethroughStyling,
  getUnderlineStyling,
  isCodeInSelection
} from "../utils/styles";
import { is } from "drizzle-orm";

// No clue what this is for
const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  // Bold
  const [isBold, setIsBold] = useState(false);
  const [isBoldDisabled, setIsBoldDisabled] = useState(false);
  // Italic
  const [isItalic, setIsItalic] = useState(false);
  const [isItalicDisabled, setIsItalicDisabled] = useState(false);
  // Underline
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUnderlineDisabled, setIsUnderlineDisabled] = useState(false);
  // Strikethrough
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isStrikethroughDisabled, setIsStrikethroughDisabled] = useState(false);

  const [showAboutDialog, setShowAboutDialog] = React.useState(false)

  const getValue = () => {
    const values = [];
    if (isBold) values.push("bold");
    if (isItalic) values.push("italic");
    if (isUnderline) values.push("underline");
    if (isStrikethrough) values.push("strikethrough");
    return values;
  };

  const {
    setOption,
    settings: {
      isDebug,
      useSelectionToolbar
    },
  } = useSettings();

  const [isCode, setIsCode] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);

  const updateToolbar = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!lexicalSelection) {
      return;
    }

    if (!$isRangeSelection(lexicalSelection)) {
      return;
    }

    const boldStyling = getBoldStyling(lexicalSelection);
    setIsBold(boldStyling.isBold);
    setIsBoldDisabled(boldStyling.isDisabled);

    const italicStyling = getItalicStyling(lexicalSelection);
    setIsItalic(italicStyling.isItalic);
    setIsItalicDisabled(italicStyling.isDisabled);

    const underlineStyling = getUnderlineStyling(lexicalSelection);
    setIsUnderline(underlineStyling.isUnderline);
    setIsUnderlineDisabled(underlineStyling.isDisabled);

    const strikethroughStyling = getStrikethroughStyling(lexicalSelection);
    setIsStrikethrough(strikethroughStyling.isStrikethrough);
    setIsStrikethroughDisabled(strikethroughStyling.isDisabled);

    setIsCode(isCodeInSelection(lexicalSelection));
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
    <div className="border-b border-gray">
      <div
        className="flex bg-white p-1 rounded-t-lg align-middle text-darkgray h-12 gap-1"
        ref={toolbarRef}
      >

        <KeyboardShortcutMenu
          open={keyboardShortcutsOpen}
          onOpenChange={setKeyboardShortcutsOpen}
        />
          
        <div className="" >
          <Button 
            variant={"ghost"} 
            size="icon"
            disabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button 
            variant={"ghost"} 
            size="icon"
            disabled={!canRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" />

        <ToggleGroup 
          size={"sm"} 
          type="multiple"
          value={getValue()}
        >
          <ToggleGroupItem 
            value="bold"
            aria-label="Toggle bold"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            disabled={isBoldDisabled}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="italic" 
            aria-label="Toggle italic"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            disabled={isItalicDisabled}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="underline" 
            aria-label="Toggle underline"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            disabled={isUnderlineDisabled}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strikethrough"
            aria-label="Toggle strikethrough"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            disabled={isStrikethroughDisabled}
          >
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" />

        <InsertElementDropdown
          editor={editor}
          openKeyboardShortcuts={setKeyboardShortcutsOpen}
        />

        <CodeDropdown
          editor={editor}
          data-shown={isCode}
          className="data-[shown=false]:hidden"
        />

        <div className="grow">

        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="left">

            <DropdownMenuLabel>KDD Editor</DropdownMenuLabel>

            
            <DropdownMenuItem
              onClick={() => {
                setShowAboutDialog(true)
              }}
            >
              <Info className="mr-2 h-4 w-4" />
              About KDD Editor
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={isDebug}
              onCheckedChange={() => {
                setOption("isDebug", !isDebug)
              }}
            >
              <Bug className="mr-2 h-4 w-4" />
              <span>Debug</span>
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Experimental</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
              checked={useSelectionToolbar}
              onCheckedChange={() => {
                setOption("useSelectionToolbar", !useSelectionToolbar)
              }}
            >
              <PictureInPicture2 className="mr-2 h-4 w-4" />
              <span>Selection Toolbar</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AboutDialog open={showAboutDialog} onOpenChange={setShowAboutDialog} />

      </div>
    </div>
  );
}
