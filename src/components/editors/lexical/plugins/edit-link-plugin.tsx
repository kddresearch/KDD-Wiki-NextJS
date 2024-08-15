import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { getLinkStyling } from "../utils/styles";
import { $createTextNode, $getSelection, $isRangeSelection, NodeKey, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
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
  Title: z.string().min(1, { message: "Title is required" }),
  Url: z.string().url({ message: "Invalid URL" }).transform((val) => {
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return val.trim();
    }

    return `https://${val.trim()}`;
  }),
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

  const [linkNode, setLinkNode] = useState<LinkNode | null>(null);
  const [linkElement, setLinkElement] = useState<HTMLAnchorElement | undefined>(undefined);
  const linkElementRef = useRef<HTMLAnchorElement | undefined>(undefined);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      Title: '',
      Url: '',
    },
  })

  const updatePosition = useCallback(() => {
    if (!linkElement) {
      console.warn('linkElement is null');
      return;
    }

    const rect = linkElement.getBoundingClientRect();
    console.log(rect);
    setPopoverLocation({ x: rect.left, y: rect.bottom });
  }, [linkElement]);

  const updateLinkEditor = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!$isRangeSelection(lexicalSelection)) {
      return;
    }

    if (lexicalSelection.isCollapsed()) {
      setIsEditing(false);
    }

    const styling = getLinkStyling(lexicalSelection);

    if (styling.isDisabled) {
      console.log('styling is disabled');
      setLinkEditorOpen(false);
      return;
    }

    if (!styling.isLink) {
      console.log('styling is not link');
      setLinkEditorOpen(false);
      setIsLink(false);
      return;
    }

    const result = $getNodesFromSelection(lexicalSelection, LinkNode);

    if (result.length === 0) {
      console.log('no links found');
      setLinkEditorOpen(false);
      setIsLink(false);
      return;
    }

    if (result.length > 1) {
      setLinkEditorOpen(false);
      setIsLink(false);
    }

    const linkNode = result[0];

    setLinkNode(linkNode);
    setLinkText(linkNode.getTitle() || linkNode.getTextContent());
    setLinkUrl(linkNode.getURL());
    setDisplayedLinkUrl(linkNode.getURL().replace(/(^\w+:|^)\/\//, ''));

    const linkElementFromEditor = editor.getElementByKey(linkNode.getKey()) as HTMLAnchorElement;

    if (!linkElementFromEditor) {
      console.warn('linkElementFromEditor is null');

      setLinkElement(undefined);
      setLinkEditorOpen(false);
      setIsLink(false);
      return;
    }

    // console.log('linkElementFromEditor', linkElementFromEditor);
    // console.log('linkElement', linkElement);
    
    setLinkElement(linkElementFromEditor);
    updatePosition();
    setLinkEditorOpen(true);
    setIsLink(styling.isLink);
  }, [editor, setLinkElement, setLinkEditorOpen, updatePosition])

  useEffect(() => {
    if (linkElement) {
      updatePosition();
    } else {
      if (LinkEditorOpen) {
        console.warn('linkElement is null, closing editor');
        setLinkEditorOpen(false);
      }
    }
  }, [linkElement, updatePosition, LinkEditorOpen]);

  const setEditorState = useCallback((open: boolean) => {

    console.log('setEditorState', open, isEditing);

    if (isEditing) {
      return;
    }

    setLinkEditorOpen(open);
    if (!open) {
      setIsEditing(false);
    }
  }, [isEditing])

  const onCopyLink = useCallback(() => {
    navigator.clipboard.writeText(linkUrl);
    toast({
      title: 'Link copied to clipboard',
      description: linkUrl,
    });
    setLinkEditorOpen(false);
  }, [linkUrl, toast]);

  const onEditLink = useCallback((event: any) => {
    setIsEditing(true);

    editor.update(() => {
      const lexicalSelection = $getSelection();

      if (!$isRangeSelection(lexicalSelection)) {
        return;
      }
  
      const styling = getLinkStyling(lexicalSelection);
  
      if (!styling.isLink) {
        return;
      }
  
      const result = $getNodesFromSelection(lexicalSelection, LinkNode);
  
      if (result.length === 0) {
        return;
      }
  
      if (result.length > 1) {
        throw new Error('Multiple links found in selection');
      }

      const linkNode = result[0];

      setLinkNode(linkNode);
      linkNode.select(0, 1);

      if (!linkElement) {
        console.warn('linkElement is null');
        return;
      }

      setLinkElement(linkElement);
      setLinkEditorOpen(true);
    })

  }, [editor, linkElement]);

  const onRemoveLink = useCallback(() => {

    editor.update(() => {
      const lexicalSelection = $getSelection();

      if (!$isRangeSelection(lexicalSelection)) {
        return;
      }
  
      const styling = getLinkStyling(lexicalSelection);
  
      if (!styling.isLink) {
        return;
      }
  
      const result = $getNodesFromSelection(lexicalSelection, LinkNode);
  
      if (result.length === 0) {
        return;
      }
  
      if (result.length > 1) {
        throw new Error('Multiple links found in selection');
      }

      const offset = lexicalSelection.focus.offset;
      const linkNode = result[0];

      setLinkNode(linkNode);

      const textNode = $createTextNode(linkNode.getTitle() || linkNode.getTextContent());
      const newNode = linkNode.replace(textNode);
      newNode.select(offset, offset);
    })

    setLinkEditorOpen(false);
  }, [editor]);

  const onSubmit = useCallback((values: z.infer<typeof linkSchema>) => {
    console.log('values', values);

    editor.update(() => {
      
      if (!linkNode) {
        console.warn('linkNode is null');
        return;
      }

      linkNode.getLatest().setTitle(values.Title);
      linkNode.getLatest().setURL(values.Url);
    })

    setLinkEditorOpen(false);
  }, [editor, linkNode]);

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

  useEffect(() => {
    if (linkElement) {
      linkElementRef.current = linkElement;
    }
  }, [linkElement]);

  useEffect(() => {
    form.reset({
      Title: linkText,
      Url: linkUrl,
    })
  }, [form, linkText, linkUrl])

  return (
    <Popover
      open={LinkEditorOpen}
      onOpenChange={setEditorState}
    >
      <PopoverAnchor asChild className="absolute" id="PopoverAnchorTHing">
        {linkElementRef.current && <div style={{
          position: 'absolute',
          top: popoverLocation.y,
          left: popoverLocation.x,
        }}></div>}
      </PopoverAnchor>
      <PopoverContent
        className="p-1 w-auto max-w-md items-center rounded-sm max-h-0 transition-all duration-300 delay-75 ease-out data-[state=open]:max-h-[500px] overflow-hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
        // style={
        //   {
        //     position: 'absolute',
        //     top: popoverLocation.y,
        //     left: popoverLocation.x,
        //   }
        // }
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
          <Button variant={'ghost'} size="icon" onClick={onCopyLink} onFocus={(event) => event.preventDefault()}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button variant={'ghost'} size="icon" onClick={onEditLink}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant={'ghost'} size="icon" onClick={onRemoveLink}>
            <Link2Off className="h-4 w-4" />
          </Button>
        </div>
        <div data-open={isEditing} className="transition-all duration-300 ease-out overflow-hidden max-h-0 delay-75 data-[open=true]:max-h-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 pb-2">
              <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="py-2 flex items-center w-full">
                      <Text className="h-4 w-4 mr-2" />
                      <FormControl className="w-auto grow" >
                        <Input placeholder="title" className="w-auto" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="ml-6"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Url"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="py-2 flex items-center w-full">
                      <Earth className="h-4 w-4 mr-2" />
                      <FormControl className="w-auto grow" >
                        <Input placeholder="https://acme.com" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="ml-6"/>
                  </FormItem>
                  //class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors text-primary underline-offset-4 h-10 px-4 py-2 max-w-xs"
                )}
              />
              <div className="grid justify-end w-full">
                {/* <div className="justify-end" /> */}
                <Button className="justify-self-end" type="submit" variant={"outline"} size="sm">
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  )
}