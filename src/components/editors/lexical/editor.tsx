"use client";

import {Suspense, useEffect, useState} from 'react';
import theme, { Disclaimer, populatePlainText } from "./theme";

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import MarkdownPlugin from "./plugins/markdown-plugin";
import ToolbarPlugin from './plugins/toolbar-plugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useToast } from "@/components/ui/use-toast"

import { $convertFromMarkdownString } from '@lexical/markdown';

import editorNodes from './nodes';

import { Placeholder, prePopulate } from './theme';
import CodeHighlightPlugin from './plugins/code-highlighting-plugin';
import ContextMenuPlugin from './plugins/context-menu-plugin';
import dynamic from 'next/dynamic';
import InsertCommandsPlugin from './plugins/insert-commands-plugin';
import { SettingsContext, useSettings } from './plugins/settings-context-plugin';
import SelectionToolbarPlugin from './plugins/selection-toolbar-plugin';
import DebugToolbar from './plugins/debug-toolbar-plugin';
import { KDD_TRANSFORMERS } from './plugins/markdown-plugin/transform';

interface MarkdownEditorProps {
  onMardownContentChange?: (newMarkdownContent: string) => void;
  useMarkdownShortcuts?: boolean;
  disableMarkdown?: boolean;
}

function Editor({
  onMardownContentChange,
  useMarkdownShortcuts = true,
  disableMarkdown,
}: 
  MarkdownEditorProps  
) {
  const {
    setOption,
    settings: {
      isDebug,
      useSelectionToolbar
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
        <AutoFocusPlugin />
        <InsertCommandsPlugin />
        <CodeHighlightPlugin />
        <LinkPlugin />
        <MarkdownPlugin useMarkdownShortcuts={useMarkdownShortcuts} onMardownContentChange={onMardownContentChange} />
        {useSelectionToolbar && <SelectionToolbarPlugin />}
        {isDebug && <DebugToolbar />}
      </ContextMenuPlugin>
    </div>
  );
};

function Loading() {
  return <div>Loading editor... (enable javascript)</div>;
}

function TextEditor({
  markdown,
  onMardownContentChange,
  usePrePopulated,
  useMarkdownShortcuts,
  showDisclaimer = true,
  disableMarkdown = false,
}: {
  markdown?: string;
  onMardownContentChange?: (newMarkdownContent: string) => void;
  usePrePopulated?: boolean;
  useMarkdownShortcuts?: boolean;
  showDisclaimer?: boolean;
  disableMarkdown?: boolean;
}) {
  const { toast } = useToast();

  const onError = (error: Error) => {
    console.error('Lexical Error:', error);
    toast({
      title: 'An unexpected error occurred in the editor',
      description: error.message,
    });
  };



  const initialConfig = {
    editorState: usePrePopulated ? // TODO: Fix this freaking ternary mess
        prePopulate // true
      :
        disableMarkdown ? // false
          () => populatePlainText(markdown ?? '') // true
        :
          () => $convertFromMarkdownString(markdown ?? '', KDD_TRANSFORMERS), // false
    namespace: 'KDD-MD-Editor',
    nodes: [...editorNodes],
    theme: theme,
    onError: onError
  };

  return (
    <Suspense fallback={<Loading />}>
      {showDisclaimer && <Disclaimer />}
      <LexicalErrorBoundary onError={onError}>
        <LexicalComposer initialConfig={initialConfig}>
          <SettingsContext>
            <Editor
              onMardownContentChange={onMardownContentChange}
              useMarkdownShortcuts={useMarkdownShortcuts}
              disableMarkdown={disableMarkdown}
            />
          </SettingsContext>
        </LexicalComposer>
      </LexicalErrorBoundary>
    </Suspense>
  )
}

const LexicalEditor = dynamic(() => Promise.resolve(TextEditor), { ssr: false });

export default LexicalEditor;
