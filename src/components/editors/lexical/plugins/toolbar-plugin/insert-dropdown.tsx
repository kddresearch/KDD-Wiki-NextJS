
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
import { Code, Heading, Heading1Icon, Heading2Icon, Heading3Icon, Keyboard, Link, PlusCircle, Settings } from "lucide-react";

import { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

interface InsertElementDropdownProps extends DropdownMenuProps {
  openKeyboardShortcuts: (open: boolean) => void;
}

function InsertElementDropdown({
  ...props
}: 
  InsertElementDropdownProps
) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Insert Element
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
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
                <DropdownMenuItem>
                  <Heading1Icon className="mr-2 h-4 w-4" />
                  <span>Heading 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heading2Icon className="mr-2 h-4 w-4" />
                  <span>Heading 2</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heading3Icon className="mr-2 h-4 w-4" />
                  <span>Heading 3</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Code className="mr-2 h-4 w-4" />
            <span>Code Block</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link className="mr-2 h-4 w-4" />
            <span>Link</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                props.openKeyboardShortcuts(true);
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