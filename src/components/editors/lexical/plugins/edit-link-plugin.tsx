import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLinkStyling } from "../utils/styles";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { $getNodesFromSelection } from "../utils";
import { Edit, Globe, Clipboard, Link2Off } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const LowPriority = 1;

export function EditLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [LinkEditorOpen, setLinkEditorOpen] = useState(false);
  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0 });
  const [linkElement, setLinkElement] = useState<HTMLElement | null>(null);

  const updateLinkEditor = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!$isRangeSelection(lexicalSelection)) {
      return;
    }

    const styling = getLinkStyling(lexicalSelection);

    if (!lexicalSelection.isCollapsed()) {
      setLinkEditorOpen(false);
      return;
    }

    if (styling.isDisabled) {
      setLinkEditorOpen(false);
      return;
    }

    if (!styling.isLink) {
      setLinkEditorOpen(false);
      setIsLink(false);
      return;
    }

    const result = $getNodesFromSelection(lexicalSelection, LinkNode);

    if (result.length === 0) {
      setLinkEditorOpen(false);
      setIsLink(false);
      return;
    }

    if (result.length > 1) {
      setLinkEditorOpen(false);
      setIsLink(false);
      throw new Error('Multiple links found in selection');
    }

    const linkNode = result[0];

    setLinkText(linkNode.getTitle() || '');
    setLinkUrl(linkNode.getURL());

    const linkElementFromEditor = editor.getElementByKey(linkNode.getKey());


    if (!linkElementFromEditor) {
      setLinkElement(null);
      setLinkEditorOpen(false);
      setIsLink(false);
      return;
    }

    console.log('linkElementFromEditor', linkElementFromEditor);
    console.log('linkElement', linkElement);
    
    setLinkElement(linkElementFromEditor);
    updatePosition();
    setLinkEditorOpen(true);
    setIsLink(styling.isLink);
  }, [setLinkElement, setLinkEditorOpen, linkElement])

  const setEditorState = useCallback((open: boolean) => {
    setLinkEditorOpen(open);
  }, [])

  const updatePosition = useCallback(() => {
    if (linkElement === null) {
      console.warn('linkElement is null');
      return;
    }

    const rect = linkElement.getBoundingClientRect();
    console.log(rect);
    setPopoverLocation({ x: rect.left, y: rect.bottom });
  }, [linkElement]);

  useEffect(() => {
    return mergeRegister(      
      editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateLinkEditor();
        return false;
      },
      LowPriority,
    ),)
  }, [editor, updateLinkEditor])

  // attach a listener for scroll events
  useEffect(() => {
    console.log('attaching listener');

    if (!LinkEditorOpen) {
      return;
    }

    const listener = () => {
      updatePosition();
      console.log('scrolling');
    };

    window.addEventListener('scroll', listener);

    return () => {
      window.removeEventListener('scroll', listener);
    };
  }, [LinkEditorOpen]);

  return (
    <Popover
      open={LinkEditorOpen}
      onOpenChange={setEditorState}
      // modal={false}
    >
      <PopoverContent
        className="p-1 flex items-center rounded-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        onOpenAutoFocus={(event) => event.preventDefault()}
        style={
          {
            position: 'absolute',
            top: popoverLocation.y,
            left: popoverLocation.x,
          }
        }
      >
        <Globe className="h-4 w-4 ml-4" />
        <Button asChild variant={"link"}>
          <Link href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-ellipsis">
            {linkUrl}
          </Link>
        </Button>
        <Button variant={'ghost'} size="icon">
          <Clipboard className="h-4 w-4" />
        </Button>
        <Button variant={'ghost'} size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant={'ghost'} size="icon">
          <Link2Off className="h-4 w-4" />
        </Button>
      </PopoverContent>
    </Popover>
  )
}