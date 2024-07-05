// "use client";

// // lexical
// import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
// import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
// import useLexicalEditable from "@lexical/react/useLexicalEditable";
// import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// import { $createTextNode, $getRoot, $getSelection } from "lexical";
// import { useEffect, useState } from "react";
// // import {
// //   $convertFromMarkdownString,
// //   $convertToMarkdownString,
// //   TRANSFORMERS,
// // } from '@lexical/markdown';
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// // Nodes
// // import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
// // import editorNodes from "./nodes";


// // custom plugins
// import ToolbarPlugin from "./plugins/toolbar-plugin";
// import theme from "./theme";
// import DraggableBlockPlugin from "./plugins/draggable-node-plugin";
// import MarkdownPlugin from "./plugins/markdown-plugin";
// import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

// function onError(error: Error) {
//   console.error(error);
// }

// function Placeholder() {
//   return <div className="text-lightgray overflow-hidden absolute text-ellipsis top-[15px] left-[10px] text-normal select-none inline-block pointer-events-none">
//     Enter some rich text...
//   </div>;
// }

// function prePopulate() {
//   const root = $getRoot();
//   if (root.getFirstChild() === null) {
//     // const heading = $createHeadingNode("h1");

//     // root.append(heading);

//     // heading.append($createTextNode("Hello world!"));
//     // root.append(heading);

//     // const quote = $createQuoteNode();
//     // quote.append($createTextNode("This is a quote for everyone talking about how good lexical is as a framework."));
//     // root.append(quote);
//   }
//   const selection = $getSelection();

// }

// const TextEditor = ({
//   markdown,
//   onContentChange,
// }: {
//   markdown?: string;
//   onContentChange: (newContent: string) => void;
// }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const initialConfig = {
//     // editorState: markdown ? () => $convertFromMarkdownString(markdown) : prePopulate,
//     namespace: "editor",
//     // nodes: [...editorNodes],
//     onError: onError,
//     theme: theme,
//   };

//   const [foatingAnchorElm, setFloatingAnchorElm] = useState<HTMLDivElement | null>(null);

//   const onRef = (_floatingAnchorElem: HTMLDivElement) => {
//     if (_floatingAnchorElem !== null) {
//       _floatingAnchorElem.id = "floating-anchor";
//       _floatingAnchorElem.className = "relative";
//       setFloatingAnchorElm(_floatingAnchorElem);
//     }
//   };

//   return (
//     <>
//       {isClient ? (
//         <LexicalComposer initialConfig={initialConfig}>
//           <Editor
//             onContentChange={onContentChange}
//             onRef={onRef}
//             foatingAnchorElm={foatingAnchorElm}
//           />
//         </LexicalComposer>
//       ) : (
//         <div>Loading editor... (enable javascript)</div>
//       )}
//     </>
//   );
// };

// const Editor = ({ 
//   onContentChange,
//   onRef,
//   foatingAnchorElm,
// }: { 
//   onContentChange: (newContent: string) => void; 
//   onRef: (elem: HTMLDivElement) => void;
//   foatingAnchorElm: HTMLDivElement | null;
// }) => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return editor.registerUpdateListener(({ editorState }) => {
//       // onContentChange(editorState.read(() => $convertToMarkdownString()));
//     });
//   }, [editor, onContentChange]);

//   return (
//     <div id="hello" className="my-5 text-black relative leading-5 font-normal text-left rounded-t-lg border-gray border rounded-b-lg">
//       <ToolbarPlugin />
//       <div id="world" className="bg-white relative prose max-w-none prose-h1:text-purple prose-a:text-purple prose-a:underline">
//         <RichTextPlugin
//           contentEditable={
//             <div className="editor-scroller">
//               <div className="editor" ref={onRef}>
//                 <ContentEditable className="min-h-[150px] resize-none text-[15px] caret-[#444)] relative tab-[1] outline-none p-[15px_10px] caret-[#444] pl-7" />
//               </div>
//             </div>
//           }
//           placeholder={<Placeholder />}
//           ErrorBoundary={LexicalErrorBoundary}
//         />
//         <HistoryPlugin />
//         {/* <MarkdownPlugin /> */}
//         <MarkdownShortcutPlugin />
//         <AutoFocusPlugin />
//         {foatingAnchorElm ? <DraggableBlockPlugin anchorElem={foatingAnchorElm} /> : null}
//       </div>
//     </div>
//   );
// };

// export default TextEditor;


import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/toolbar-plugin';

function onError(error: Error) {
  console.error(error);
}

const theme = {
  // Theme styling goes here
  //...
}

function Placeholder() {
  return <div className="text-lightgray overflow-hidden absolute text-ellipsis top-[15px] left-[10px] text-normal select-none inline-block pointer-events-none">
    Enter some rich text...
  </div>;
}

function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder/>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

function textEditor() {
  return <div>Loading editor... (enable javascript)</div>;
}

export default Editor;