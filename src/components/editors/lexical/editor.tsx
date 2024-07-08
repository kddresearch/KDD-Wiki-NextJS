"use client";

// // // // lexical
// // // import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
// // // import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
// // // import useLexicalEditable from "@lexical/react/useLexicalEditable";
// // // import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// // // import { LexicalComposer } from "@lexical/react/LexicalComposer";
// // // import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// // // import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// // // import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// // // import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// // // import { useEffect, useState } from "react";
// // // // import {
// // // //   $convertFromMarkdownString,
// // // //   $convertToMarkdownString,
// // // //   TRANSFORMERS,
// // // // } from '@lexical/markdown';
// // // import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// // // // Nodes
// // // import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
// // // // import editorNodes from "./nodes";


// // // // custom plugins
// // // import ToolbarPlugin from "./plugins/toolbar-plugin";
// // // import theme from "./theme";
// // // import DraggableBlockPlugin from "./plugins/draggable-node-plugin";
// // // import MarkdownPlugin from "./plugins/markdown-plugin";
// // // import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

// // // function onError(error: Error) {
// // //   console.error(error);
// // // }

// // // function Placeholder() {
// // //   return <div className="text-lightgray overflow-hidden absolute text-ellipsis top-[15px] left-[10px] text-normal select-none inline-block pointer-events-none">
// // //     Enter some rich text...
// // //   </div>;
// // // }

// // // function prePopulate() {
// // //   const root = $getRoot();
// // //   if (root.getFirstChild() === null) {
// // //     // const heading = $createHeadingNode("h1");

// // //     // root.append(heading);

// // //     // heading.append($createTextNode("Hello world!"));
// // //     // root.append(heading);

// // //     // const quote = $createQuoteNode();
// // //     // quote.append($createTextNode("This is a quote for everyone talking about how good lexical is as a framework."));
// // //     // root.append(quote);
// // //   }
// // //   const selection = $getSelection();

// // // }

// // // const TextEditor = ({
// // //   markdown,
// // //   onContentChange,
// // // }: {
// // //   markdown?: string;
// // //   onContentChange: (newContent: string) => void;
// // // }) => {
//   // const [isClient, setIsClient] = useState(false);

//   // useEffect(() => {
//   //   setIsClient(true);
//   // }, []);

// // //   const initialConfig = {
// // //     // editorState: markdown ? () => $convertFromMarkdownString(markdown) : prePopulate,
// // //     namespace: "editor",
// // //     // nodes: [...editorNodes],
// // //     onError: onError,
// // //     theme: theme,
// // //   };

// // //   const [foatingAnchorElm, setFloatingAnchorElm] = useState<HTMLDivElement | null>(null);

// // //   const onRef = (_floatingAnchorElem: HTMLDivElement) => {
// // //     if (_floatingAnchorElem !== null) {
// // //       _floatingAnchorElem.id = "floating-anchor";
// // //       _floatingAnchorElem.className = "relative";
// // //       setFloatingAnchorElm(_floatingAnchorElem);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {isClient ? (
// // //         <LexicalComposer initialConfig={initialConfig}>
// // //           <Editor
// // //             onContentChange={onContentChange}
// // //             onRef={onRef}
// // //             foatingAnchorElm={foatingAnchorElm}
// // //           />
// // //         </LexicalComposer>
// // //       ) : (
// // //         <div>Loading editor... (enable javascript)</div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // const Editor = ({ 
// // //   onContentChange,
// // //   onRef,
// // //   foatingAnchorElm,
// // // }: { 
// // //   onContentChange: (newContent: string) => void; 
// // //   onRef: (elem: HTMLDivElement) => void;
// // //   foatingAnchorElm: HTMLDivElement | null;
// // // }) => {
// // //   const [editor] = useLexicalComposerContext();

// // //   useEffect(() => {
// // //     return editor.registerUpdateListener(({ editorState }) => {
// // //       // onContentChange(editorState.read(() => $convertToMarkdownString()));
// // //     });
// // //   }, [editor, onContentChange]);

// // //   return (
// // //     <div id="hello" className="my-5 text-black relative leading-5 font-normal text-left rounded-t-lg border-gray border rounded-b-lg">
// // //       <ToolbarPlugin />
// // //       <div id="world" className="bg-white relative prose max-w-none prose-h1:text-purple prose-a:text-purple prose-a:underline">
// // //         <RichTextPlugin
// // //           contentEditable={
// // //             <div className="editor-scroller">
// // //               <div className="editor" ref={onRef}>
// // //                 <ContentEditable className="min-h-[150px] resize-none text-[15px] caret-[#444)] relative tab-[1] outline-none p-[15px_10px] caret-[#444] pl-7" />
// // //               </div>
// // //             </div>
// // //           }
// // //           placeholder={<Placeholder />}
// // //           ErrorBoundary={LexicalErrorBoundary}
// // //         />
// // //         <HistoryPlugin />
// // //         {/* <MarkdownPlugin /> */}
// // //         <MarkdownShortcutPlugin />
// // //         <AutoFocusPlugin />
// // //         {foatingAnchorElm ? <DraggableBlockPlugin anchorElem={foatingAnchorElm} /> : null}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TextEditor;


import { $createTextNode, $getRoot, $getSelection, EditorState } from 'lexical';
import {useEffect, useState} from 'react';
import theme from "./theme";

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import MarkdownPlugin from "./plugins/markdown-plugin";
import ToolbarPlugin from './plugins/toolbar-plugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import PlaygroundEditorTheme from "@/components/editor/themes/PlaygroundEditorTheme";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import Placeholder from "@/components/editor/ui/Placeholder";
// import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

// import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
// import { $createTextNode, $getRoot } from "lexical";

import type {Klass, LexicalNode} from 'lexical';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {TableCellNode, TableNode, TableRowNode} from '@lexical/table';

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
// import editorNodes from './nodes';

const editorNodes: Array<Klass<LexicalNode>> = [
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
  HeadingNode,
  QuoteNode,
  TableCellNode,
  TableNode,
  TableRowNode,
];

function onError(error: Error) {
  console.error(error);
}

function Placeholder() {
  return <div className="text-gray overflow-hidden absolute text-ellipsis top-[0px] left-[38px] text-normal select-none inline-block pointer-events-none">
    Enter some rich text...
  </div>;
}

function prePopulate() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode("h1");

    root.append(heading);

    heading.append($createTextNode("Hello world!"));
    root.append(heading);

    // const quote = $createQuoteNode();
    // quote.append($createTextNode("This is a quote for everyone talking about how good lexical is as a framework."));
    // root.append(quote);
  }
}

export function getPrepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Welcome to the playground'));
    root.append(heading);

    const code = $createQuoteNode();
    code.append($createTextNode('what the flip guys -me in 2024 working on this'));
    root.append(code);
  }
}


function Editor() {
  return (
    <div id="hello" className="my-5 text-black relative leading-5 font-normal text-left rounded-t-lg border-gray border rounded-b-lg">
      <ToolbarPlugin />
      <div id="world" className="bg-white relative prose max-w-none prose-h1:text-purple prose-a:text-purple prose-a:underline">
        <RichTextPlugin
          contentEditable={                
            <ContentEditable 
              className="min-h-[150px] resize-none text-[15px] caret-[#444)] relative tab-[1] outline-none m-[15px_10px] caret-[#444] pl-7"
            />
          }
          placeholder={<Placeholder/>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MarkdownPlugin />
        {/* <MarkdownShortcutPlugin /> */}
        {/* <AutoFocusPlugin /> */}
        {/* {foatingAnchorElm ? <DraggableBlockPlugin anchorElem={foatingAnchorElm} /> : null} */}
      </div>
    </div>
  );
};

function TextEditor({
  markdown,
}: {
  markdown?: string;
  // onContentChange: (newContent: string) => void;
}) {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialConfig = {
    editorState: getPrepopulatedRichText,
    namespace: 'KDD-MD-Editor',
    nodes: [...editorNodes],
    theme: theme,
    onError: (error: Error) => {
      throw error;
    },
  };

  return (
    isClient ? (
      <LexicalComposer initialConfig={initialConfig}>
        <Editor/>
      </LexicalComposer>
    ) : (
      <div>Loading editor... (enable javascript)</div>
    )
  )
}

export default TextEditor;

export function LexicalEditor2(): JSX.Element {

  const initialConfig = {
    editorState: getPrepopulatedRichText,
    namespace: "Playground",
    nodes: [...editorNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: theme,
  };
  
  const text = "Enter some rich text...";
  const placeholder = <div>{text}</div>;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <HistoryPlugin/>
      <RichTextPlugin
        contentEditable={
          <ContentEditable />
        }
        placeholder={placeholder}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
