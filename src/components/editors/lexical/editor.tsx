"use client";

import {Suspense, useCallback, useEffect, useState} from 'react';
import theme, { Disclaimer, populatePlainText } from "./theme";

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { $getRoot, LexicalEditor } from 'lexical';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import MarkdownPlugin, { TOGGLE_DIRECT_MARKDOWN_COMMAND } from "./plugins/markdown-plugin";
import ToolbarPlugin from './plugins/toolbar-plugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useToast } from "@/components/ui/use-toast"

import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';

import editorNodes from './nodes';
import { ListPlugin } from './plugins/list-plugin';

import { Placeholder, prePopulate } from './theme';
import CodeHighlightPlugin from './plugins/code-highlighting-plugin';
import ContextMenuPlugin from './plugins/context-menu-plugin';
import dynamic from 'next/dynamic';
import InsertCommandsPlugin from './plugins/insert-commands-plugin';
import { SettingsContext, useSettings } from './plugins/settings-context-plugin';
import SelectionToolbarPlugin from './plugins/selection-toolbar-plugin';
import DebugToolbar from './plugins/debug-toolbar-plugin';
import { KDD_TRANSFORMERS } from './plugins/markdown-plugin/transform';
import KeyboardCommandsPlugin from './plugins/keyboard-commands-plugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createMakrdownEditorCodeNode, $isMakrdownEditorCodeNode } from './nodes/markdown';

interface MarkdownEditorProps {
  markdown?: string;
  onMardownContentChange?: (newMarkdownContent: string) => void;
  usePrePopulated?: boolean;
  useMarkdownShortcuts?: boolean;
  disableMarkdown?: boolean;
  onError: (error: Error, editor: LexicalEditor) => void;
}

function Editor({
  markdown,
  onMardownContentChange,
  usePrePopulated,
  useMarkdownShortcuts = true,
  disableMarkdown,
  onError,
}: 
  MarkdownEditorProps  
) {
  const {
    setOption,
    settings: {
      isDebug,
      useSelectionToolbar,
      editInMarkdown
    },
  } = useSettings();

  const populateMarkdownEditor = useCallback((prePopulate?: () => void) => {
    let markdownString;

    if (prePopulate) {
      prePopulate();
      markdownString = $convertToMarkdownString(KDD_TRANSFORMERS);
    }

    if (!editInMarkdown) {
      setOption('editInMarkdown', true);
    }

    const root = $getRoot();
    root
      .clear()
      .append(
        $createMakrdownEditorCodeNode(markdownString ?? '')
      );
  }, [editInMarkdown, setOption]);

  console.log('editInMarkdown', editInMarkdown);

  const initialConfig = {
    // editorState: usePrePopulated
    //   ? prePopulate
    //   : disableMarkdown
    //     ? () => populatePlainText(markdown ?? '')
    editorState: usePrePopulated
    ? editInMarkdown
      ? () => populateMarkdownEditor(() => prePopulate())
      : () => prePopulate()
    : editInMarkdown
      ? () => populateMarkdownEditor(() => $convertFromMarkdownString(markdown ?? '', KDD_TRANSFORMERS))
      : () => $convertFromMarkdownString(markdown ?? '', KDD_TRANSFORMERS),
    namespace: 'KDD-MD-Editor',
    nodes: [...editorNodes],
    theme: theme,
    onError: onError
  };

  return (
    <>
      {editInMarkdown && <Disclaimer />}
      <LexicalComposer initialConfig={initialConfig}>
        <div id="hello" className="bg-white text-black relative leading-5 font-normal text-left rounded-lg border-gray border">
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
            <ListPlugin />
            <InsertCommandsPlugin />
            <CodeHighlightPlugin />
            <LinkPlugin />
            <KeyboardCommandsPlugin />
            <MarkdownPlugin useMarkdownShortcuts={useMarkdownShortcuts} onMardownContentChange={onMardownContentChange} />
            {useSelectionToolbar && <SelectionToolbarPlugin />}
            {isDebug && <DebugToolbar />}
          </ContextMenuPlugin>
        </div>
      </LexicalComposer>
    </>

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

  return (
    <Suspense fallback={<Loading />}>
      <LexicalErrorBoundary onError={onError}>
        <SettingsContext>
          <Editor
            markdown={markdown}
            onMardownContentChange={onMardownContentChange}
            usePrePopulated={usePrePopulated}
            useMarkdownShortcuts={useMarkdownShortcuts}
            disableMarkdown={disableMarkdown}
            onError={onError}
          />
        </SettingsContext>
      </LexicalErrorBoundary>
    </Suspense>
  )
}

const KDDEditor = dynamic(() => Promise.resolve(TextEditor), { ssr: false });

export default KDDEditor;
