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
// import { ArrowClockwise, ArrowCounterclockwise, Code, Justify, Link, TextCenter, TextLeft, TextRight, TypeBold, TypeItalic, TypeStrikethrough, TypeUnderline } from "react-bootstrap-icons";
import { getSelectedNode, sanitizeURL } from "../utils";
import { $isCodeNode, getCodeLanguages, getLanguageFriendlyName } from '@lexical/code';

import { Bold, Italic, Underline, Strikethrough, Undo, Redo, Code, Link, User, CreditCard, Settings, Keyboard, Users, UserPlus, Mail, MessageSquare, PlusCircle, Plus, Github, LifeBuoy, Cloud, LogOut, Calendar, Smile, Calculator, Heading1Icon, Heading2Icon, Heading3Icon, Heading } from "lucide-react"
import { Combobox } from "@/components/ui/combo-box";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import KeyboardShortcutMenu from "./toolbar-plugin/keyboard-shortcut-menu";
import InsertElementDropdown from "./toolbar-plugin/insert-dropdown";

const getSelectionCoordinates = () => {
  const selection = window.getSelection();

  if (selection === null) {
    return null;
  }

  if (selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0).cloneRange();
  const rect = range.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
};

// No clue what this is for
const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [currentElementEditor, setCurrentElementEditor] = useState();

  const getValue = () => {
    const values = [];
    if (isBold) values.push("bold");
    if (isItalic) values.push("italic");
    if (isUnderline) values.push("underline");
    if (isStrikethrough) values.push("strikethrough");
    return values;
  };

  // Blocks
  const [currentNode, setCurrentNode] = useState<TextNode | ElementNode | null>(null);

  const [isLink, setIsLink] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  const [isCode, setIsCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("plaintext");

  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      // setIsCode(selection.hasFormat('code'));

      let selectedNode = getSelectedNode(selection);

      const popoverPosition = getSelectionCoordinates();
      if (popoverPosition !== null) {
        console.log(popoverPosition);

        setPopoverPosition(popoverPosition);
      }

      setCurrentNode(selectedNode);

      let nodes = [];

      while (selectedNode !== null) {
        nodes.push(selectedNode);

        if (selectedNode.getParent() === null) {
          break;
        } else {
          selectedNode = selectedNode.getParent()!;
        }
      }

      for (let node of nodes) {
        if ($isLinkNode(node)) {
          setIsLink(true);
          break;
        } else {
          setIsLink(false);
        }
      }

      for (let node of nodes) {
        if ($isCodeNode(node)) {
          const language = node.getLanguage();

          if (language === null) {
            setCodeLanguage("plaintext");
          } else {
            console.log("Language: ", language!);
            setCodeLanguage(language!);
          }

          setIsCode(true);
          break;
        } else {
          setIsCode(false);
        }
      }
    }
  }, []);

  const removeLink = (opening: boolean) => {

    console.log("isOpening: ", opening);

    console.log("Removing link");

    if (opening) {
      return;
    }

    editor.update(() => {

      let node = currentNode;

      while (node !== null) {
        if (node.getParent() === null) {
          break;
        } else if ($isLinkNode(node)) {
          break;
        } else {
          node = node.getParent()!;
        }
      }

      const selection = $getSelection();

      if (selection === null) {
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      let selectedNode = getSelectedNode(selection);

      if ($isLinkNode(node)) {
        // Move text content to parent
        const parent = node.getParent()!;
        const text = node.getTextContent();

        // edit the contend of the parent node to the original text

        node.remove();

        console.log("Really removing link");
      }
    });
  };

  const updateLink = () => {};

  const insertLink = useCallback(() => {

    console.log("Inserting link");

    editor.update(() => {
    
      const selection = $getSelection();

      if (selection === null) {
        return;
      }

      // get selection content
      const content = selection.getTextContent();
      setLinkTitle(content);

      console.log("isLink: ", isLink);

      if (isLink) {

        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      let selectedNode = getSelectedNode(selection);

      if ($isLinkNode(selectedNode)) {
        setIsLink(true);
        setLinkTitle(selectedNode.getTextContent());
        setLinkURL(selectedNode.getURL());
        return;
      }

      editor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        "",
      );
    });
  }, [editor, isLink]);

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

  const onSelectLanguage = (language: string) => {

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      let node = getSelectedNode(selection);
      let codeNode = null;

      // Get all nodes up to the parent
      while (node !== null) {

        if ($isCodeNode(node)) {
          codeNode = node;
          break;
        }

        if (node.getParent() === null) {
          break;
        } else {
          node = node.getParent()!;
        }
      }

      if (codeNode === null) {
        return;
      }

      codeNode.setLanguage(language);
      setCodeLanguage(language);
    });
  };

  const languages = getCodeLanguages().map((language) => {
    return {
      value: language,
      label: getLanguageFriendlyName(language),
    };
  });


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
          // className="mx-1"
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

        <Separator orientation="vertical" />

        <InsertElementDropdown openKeyboardShortcuts={setKeyboardShortcutsOpen}/>

        {isCode ? (
          <>
            <Separator orientation="vertical" className="my-1" />
            <Combobox
              className={`transition-transform duration-300 ease-in-out1 ${isCode ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-4 opacity-0'}`}
              options={languages}
              defaultSelect={codeLanguage}
              onSelect={onSelectLanguage}
              type="language"
            />
          </>
        ) : (
          <>
          </>
        )}

      </div>
    </div>
  );
}
