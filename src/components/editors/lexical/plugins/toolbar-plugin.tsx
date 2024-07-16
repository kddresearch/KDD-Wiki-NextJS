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
import { Combobox } from "@/components/ui/combo-box";

import { Bold, Italic, Underline, Strikethrough, Undo, Redo, Code, Link } from "lucide-react"
 
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { any } from "joi";

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

  const removeLink = (open: boolean) => {

    console.log("isOpenNow: ", open);

    console.log("Removing link");

    editor.update(() => {
      if ($isLinkNode(currentNode)) {
        console.log("Really removing link");
        currentNode.remove();
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

        <div
          data-active={isCode ? "true" : "false"}
          className="flex transition-all duration-75 items-center rounded-md text-secondary-foreground gap-1 h-10 px-[1px]"
          // className='flex transition-all duration-75 items-center rounded-md text-secondary-foreground gap-1 h-10 px-[1px] data-[active=false]:border-0 data-[active=true]:border '
        >
          <Toggle
            size={"sm"}
            onClick={() => {
              console.log("isCode: ", isCode);
            }}
            pressed={isCode}
          > 
            <Code className="h-4 w-4" />
          </Toggle>
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

        <div className="flex items-center h-10">
          <Popover
            onOpenChange={removeLink}
          >
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                size="icon"
                onClick={insertLink}
              >
                <Link className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Insert Link</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the link content and URL
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width">Title</Label>
                    <Input
                      id="width"
                      placeholder="Title"
                      className="col-span-2 h-8"
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth">URL</Label>
                    <Input
                      id="maxWidth"
                      placeholder="https://"
                      className="col-span-2 h-8"
                      value={linkURL}
                      onChange={(e) => setLinkURL(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={updateLink}>
                    Update Link
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Code Block Button */}

      </div>
    </div>
  );
}
