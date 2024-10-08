
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
import {
  CircleAlert,
  Code,
  Heading,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Info,
  Keyboard,
  Link,
  List,
  OctagonAlert,
  PlusCircle,
  Quote
} from "lucide-react";
import { LexicalEditor } from "lexical";
import {
  COMMANDS
} from "../insert-commands-plugin";

import {
  SiTypescript,
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
      modal={false}
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
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Info className="mr-2 h-4 w-4" />
              <span>Alert</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_ALERT_DEFAULT, undefined);
                  }}
                >
                  <Info className="mr-2 h-4 w-4" />
                  <span>Default</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_ALERT_PRIMARY, undefined);
                  }}
                >
                  <CircleAlert className="mr-2 h-4 w-4" />
                  <span>Primary</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor.dispatchCommand(COMMANDS.INSERT_ALERT_DESTRUCTIVE, undefined);
                  }}
                >
                  <OctagonAlert className="mr-2 h-4 w-4" />
                  <span>Destructive</span>
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

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(COMMANDS.INSERT_LINK, undefined);
            }}
          >
            <Link className="mr-2 h-4 w-4" />
            <span>Link</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(COMMANDS.INSERT_QUOTE, undefined);
            }}
          >
            <Quote className="mr-2 h-4 w-4" />
            <span>Quote</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              editor.dispatchCommand(COMMANDS.INSERT_LIST, undefined);
            }}
          >
            <List className="mr-2 h-4 w-4" />
            <span>List</span>
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