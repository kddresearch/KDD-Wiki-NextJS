import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLinkStyling } from "../utils/styles";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { $getNodesFromSelection } from "../utils";
import { Edit, Clipboard, Link2Off, Earth, Text } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const linkSchema = z.object({
  Title: z.string().optional(),
  Url: z.string().url({ message: "Invalid URL" }),
})

const LowPriority = 1;

export function EditLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  const [isLink, setIsLink] = useState(false);

  const [linkUrl, setLinkUrl] = useState('');
  const [displayedLinkUrl, setDisplayedLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [LinkEditorOpen, setLinkEditorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0 });
  const [linkElement, setLinkElement] = useState<HTMLElement | null>(null);

  const { toast } = useToast();


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
    // Remove protocol from displayed link
    setDisplayedLinkUrl(linkNode.getURL().replace(/(^\w+:|^)\/\//, ''));

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

  const onCopyLink = useCallback(() => {
    navigator.clipboard.writeText(linkUrl);
    toast({
      title: 'Link copied to clipboard',
      description: linkUrl,
    });
    setLinkEditorOpen(false);
  }, [linkUrl]);

  const onEditLink = useCallback(() => {
    setIsEditing(true);
    setLinkEditorOpen(false);
  }, []);

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

  const onSubmit = useCallback((values: z.infer<typeof linkSchema>) => {
    console.log('values', values);
  }, [])

  const form = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      Title: linkText,
      Url: linkUrl,
    },
  })

  return (
    <Popover
      open={LinkEditorOpen}
      onOpenChange={setEditorState}
    >
      <PopoverContent
        className="p-1 w-auto max-w-md items-center rounded-sm"
        onOpenAutoFocus={(event) => event.preventDefault()}
        style={
          {
            position: 'absolute',
            top: popoverLocation.y,
            left: popoverLocation.x,
          }
        }
      >
        <div className="flex items-center">
          <Button asChild variant={"link"}>
            <Link href={linkUrl} target="_blank" rel="noopener noreferrer" className="max-w-xs">
              <Earth className="h-4 w-4 mr-2" />
              <p className="overflow-hidden text-nowrap overflow-ellipsis">
                {displayedLinkUrl}
              </p>
            </Link>
          </Button>
          <Button variant={'ghost'} size="icon" onClick={onCopyLink}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button variant={'ghost'} size="icon" onClick={onEditLink}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant={'ghost'} size="icon">
            <Link2Off className="h-4 w-4" />
          </Button>
        </div>
        {isEditing && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                  <FormItem className="px-4 py-2 space-y-0">
                    <div className="flex items-center">
                      <Text className="h-4 w-4 mr-2" />
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="ml-4"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Url"
                render={({ field }) => (
                  <FormItem className="px-4 py-2 space-y-0">
                    <div className="inline-flex items-center">
                      <Earth className="h-4 w-4 mr-2 grow" />
                      <FormControl className="grow-0">
                        <Input placeholder="https://acme.com" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="ml-4"/>
                  </FormItem>
                )}
              />
              <div className="flex px-4">
                <div className="grow" />
                <Button type="submit" variant={"outline"} size="sm">
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        )}
      </PopoverContent>
    </Popover>
  )
}