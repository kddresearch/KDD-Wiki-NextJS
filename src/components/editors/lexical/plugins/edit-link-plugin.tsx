import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { getLinkStyling } from "../utils/styles";
import { $createTextNode, $getSelection, $isRangeSelection, NodeKey, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { $isLinkNode, LinkNode } from "@lexical/link";
import { $getElementsUpToEditorRoot, $getNodesFromSelection } from "../utils";
import { Edit, Clipboard, Link2Off, Earth, Text, Bug } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icon, IconFallback, IconImage } from "@/components/ui/icon";
import { useSettings } from "./settings-context-plugin";

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
  const {
    setOption,
    settings: {
      isDebug,
      useSelectionToolbar,
      editInMarkdown,
      disableContextMenu
    },
  } = useSettings();

  const [editor] = useLexicalComposerContext();

  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [iconUrl, setIconUrl] = useState('');

  const [showEditor, setShowEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [popoverLocation, setPopoverLocation] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const [linkNode, setLinkNode] = useState<LinkNode | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      Title: '',
      Url: '',
    },
  })

  // Callbacks
  const updatePosition = useCallback(() => {
    if (!linkNode) {
      console.warn('linkNode is null');
      return;
    }

    const elements = $getElementsUpToEditorRoot(linkNode, editor)

    // Anchor element is relative to the editor
    const result = elements.reduce((acc, element, index) => {
      // First element is the anchor element
      if (index === 0) {
        acc.x = element.offsetLeft;
        acc.y = element.offsetTop;
        acc.width = element.offsetWidth;
        acc.height = element.offsetHeight;

        return acc;
      }

      // if element is relative 
      if (element.style.position === 'relative' || element.classList.contains('relative')) { // TODO: Make check more robust for non-tailwind
        acc.x += element.offsetLeft;
        acc.y += element.offsetTop;
        return acc;
      }
      return acc;
    }, { x: 0, y: 0, width: 0, height: 0 });

    setPopoverLocation(result);
  }, [linkNode, editor]);

  const setEditorState = useCallback((open: boolean) => {
    console.log('setEditorState', open, isEditing);

    if (isEditing) {
      return;
    }

    setShowEditor(open);
  }, [isEditing])

  const updateLinkEditor = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!$isRangeSelection(lexicalSelection)) {
      return;
    }

    if (lexicalSelection.isCollapsed()) {
      setIsEditing(false);
    }

    const result = $getNodesFromSelection(lexicalSelection, LinkNode);

    if (result.length !== 1) {
      setShowEditor(false);
      return;
    }

    const linkNode = result[0];

    const url = new URL(linkNode.getURL());
    setIconUrl(`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`); // Fetch favicon from duckduckgo

    setLinkUrl(linkNode.getURL());
    setLinkNode(linkNode);

    updatePosition();
    setShowEditor(true);
  }, [setShowEditor, updatePosition, setIsEditing])

  const onCopyLink = useCallback(() => {
    navigator.clipboard.writeText(linkUrl);
    toast({
      title: 'Link copied to clipboard',
      description: linkUrl,
    });
    setEditorState(false);
  }, [linkUrl, toast, setEditorState]);

  const onEditLink = useCallback((event: any) => {
    setIsEditing(true);

    editor.update(() => {
      if (!linkNode) {
        console.warn('linkNode is null');
        return;
      }

      const latest = linkNode.getLatest();

      setLinkText(latest.getTitle() || latest.getTextContent());
      setLinkUrl(latest.getURL());

      setLinkNode(latest);
      latest.select(0, 1);
    })
  }, [editor, linkNode]);

  const onRemoveLink = useCallback(() => {
    editor.update(() => {
      if (!linkNode) {
        console.warn('linkNode is null');
        return;
      }

      const latest = linkNode.getLatest();

      setLinkNode(latest);

      const textNode = $createTextNode(latest.getTextContent());
      const newNode = linkNode.replace(textNode);
      newNode.getLatest().select(0, 1);
    })
  }, [editor, linkNode]);

  const onSubmit = useCallback((values: z.infer<typeof linkSchema>) => {
    console.log('values', values);

    editor.update(() => {
      
      if (!linkNode) {
        console.warn('linkNode is null');
        return;
      }

      linkNode.getLatest().setTitle(values.Title);
      linkNode.getLatest().setURL(values.Url);

      setLinkNode(linkNode);
      linkNode.selectEnd();
    })
  }, [editor, linkNode]);

  // onMount

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
    if (linkNode) {
      editor.update(() => {
        updatePosition();
      })
    } else {
      if (showEditor) {
        console.warn('linkNode is null', false);
        setShowEditor(false);
      }
    }
  }, [linkNode, editor, updatePosition, showEditor]);

  useEffect(() => {
    form.reset({
      Title: linkText,
      Url: linkUrl,
    })
  }, [form, linkText, linkUrl])

  return (
    <Popover
      open={showEditor}
    >
      <PopoverAnchor asChild>
        {linkNode && (
          <div
            id="link-editor-anchor"
            className={`absolute pointer-events-none ml-2 mt-16 p-1 ${isDebug ? 'opacity-50 bg-purple ' : ''}`}
            style={
              {
                height: popoverLocation.height,
                width: popoverLocation.width,
                top: popoverLocation.y,
                left: popoverLocation.x,
              }
            } 
          />
        )}
      </PopoverAnchor>
      <PopoverContent
        className="p-1 w-auto max-w-md items-center rounded-sm overflow-hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
        align="start"
      >
        <div className="flex items-center">

          {/* Open Link */}
          <Button asChild variant={"link"} className="w-48 justify-start">
            <Link href={linkUrl} title={linkUrl} target="_blank" rel="noopener noreferrer">
              <Icon className="w-auto h-auto mr-2 min-w-4">
                <IconImage src={iconUrl} width={24} height={24} alt="Link Icon" className="h-6 w-6" />
                <IconFallback asChild className="h-4 w-4">
                  <Earth />
                </IconFallback>
              </Icon>
              <p className="truncate">
                {linkUrl.replace(/(^\w+:|^)\/\//, '').replace(/^(www\.)/, '')}
              </p>
            </Link>
          </Button>

          <TooltipProvider>

            {/* Copy Button */}
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} size="icon" onClick={onCopyLink} onFocus={(event) => event.preventDefault()}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Copy link
              </TooltipContent>
            </Tooltip>

            {/* Edit Button */}
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} size="icon" onClick={onEditLink}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Edit link
              </TooltipContent>
            </Tooltip>

            {/* Remove Link */}
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} size="icon" onClick={onRemoveLink}>
                  <Link2Off className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                Remove link
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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