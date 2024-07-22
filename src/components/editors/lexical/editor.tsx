"use client";

import {useEffect, useState} from 'react';
import theme from "./theme";

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import MarkdownPlugin from "./plugins/markdown-plugin";
import ToolbarPlugin from './plugins/toolbar-plugin';
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TreeView } from '@lexical/react/LexicalTreeView';

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';

import editorNodes from './nodes';

import { Placeholder, prePopulate } from './theme';
import CodeHighlightPlugin from './plugins/code-highlighting-plugin';
import ContextMenuPlugin from './plugins/context-menu-plugin';
import dynamic from 'next/dynamic';
import InsertCommandsPlugin from './plugins/insert-commands-plugin';
import TreeViewPlugin from './plugins/tree-view-plugin';
import { SettingsContext, useSettings } from './plugins/settings-context-plugin';
import SelectionToolbarPlugin from './plugins/selection-toolbar-plugin';

function onError(error: Error) {
  console.error(error);
}


function Editor() {

  const {
    setOption,
    settings: {
      isDebug
    },
  } = useSettings();

  return (
    <div id="hello" className="my-5 bg-white text-black relative leading-5 font-normal text-left rounded-lg border-gray border">
      <ToolbarPlugin />
      <ContextMenuPlugin className="relative prose max-w-none prose-h1:text-purple prose-a:text-purple prose-a:underline">
        <RichTextPlugin
          contentEditable={                
            <ContentEditable
              id='lexical-text-editable'
              className="bg-white min-h-[150px] resize-none text-[15px] caret-darkGray relative outline-none m-[15px_10px] caret-[#444] px-6"
            />
          }
          placeholder={<Placeholder/>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MarkdownPlugin />
        <AutoFocusPlugin />
        <MarkdownShortcutPlugin />
        <InsertCommandsPlugin />
        <CodeHighlightPlugin />
        <LinkPlugin />
        <SelectionToolbarPlugin />
        {isDebug && <TreeViewPlugin />}
      </ContextMenuPlugin>
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
    editorState: markdown ? () => $convertFromMarkdownString(markdown) : prePopulate,
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
        <SettingsContext>
          <Editor/>
        </SettingsContext>
      </LexicalComposer>
    ) : (
      <div>Loading editor... (enable javascript)</div>
    )
  )
}

const LexicalEditor = dynamic(() => Promise.resolve(TextEditor), { ssr: false });

export default LexicalEditor;
