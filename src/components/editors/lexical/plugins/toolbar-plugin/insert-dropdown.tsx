
import { Button } from "@/components/ui/button";
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
import { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";
import { Code, Heading, Heading1Icon, Heading2Icon, Heading3Icon, Keyboard, Link, PlusCircle, Settings } from "lucide-react";

import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand, LexicalEditor } from "lexical";
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import { $createHeadingNode } from "@lexical/rich-text";
import { useEffect } from "react";
import {
  COMMANDS
} from "../insert-commands-plugin";

import {
  FaPython,
  FaSquareJs,
  FaSquare
} from "react-icons/fa6";

import {
  SiTypescript,
  SiJavascript,
  SiMarkdown,
  SiPython
} from "react-icons/si";


interface InsertElementDropdownProps extends DropdownMenuProps {
  openKeyboardShortcuts: (open: boolean) => void;
  editor: LexicalEditor;
  disabled?: boolean;
}

function InsertElementDropdown({
  editor,
  openKeyboardShortcuts,
  disabled,
  ...props
}: 
  InsertElementDropdownProps
) {
  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) {
          editor.focus();
        }
      }}
      {...props}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Insert Element
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" onCloseAutoFocus={(event) => {
        event.preventDefault();
      }}>
        <DropdownMenuLabel>Insert Element</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Heading className="mr-2 h-4 w-4" />
              <span>Headings</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_H1, undefined);
                  }}
                >
                  <Heading1Icon className="mr-2 h-4 w-4" />
                  <span>Heading 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_H2, undefined);
                  }}
                >
                  <Heading2Icon className="mr-2 h-4 w-4" />
                  <span>Heading 2</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_H3, undefined);
                  }}
                >
                  <Heading3Icon className="mr-2 h-4 w-4" />
                  <span>Heading 3</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Code className="mr-2 h-4 w-4" />
              <span>Code Block</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_CODE_BLOCK_PY, undefined);
                  }}
                >
                  <SiPython className="mr-2 h-4 w-4" />
                  <span>Python</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_CODE_BLOCK_TS, undefined);
                  }}
                >
                  <SiTypescript className="mr-2 h-4 w-4" />
                  <span>TypeScript</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_CODE_BLOCK_MD, undefined);
                  }}
                >
                  <SiMarkdown className="mr-2 h-4 w-4" />
                  <span>Markdown</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_CODE_BLOCK, undefined);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Other...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(COMMANDS.INSERT_CODE_BLOCK, undefined);
            }}
          >
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(COMMANDS.INSERT_LINK, "myPayload");
            }}
          >
            <Link className="mr-2 h-4 w-4" />
            <span>Link</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              openKeyboardShortcuts(true);
            }}
          >
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default InsertElementDropdown;