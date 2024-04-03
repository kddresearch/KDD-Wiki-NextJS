// lexical
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import useLexicalEditable from "@lexical/react/useLexicalEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

// custom plugins
import ToolbarPlugin from "./plugins/toolbar-plugin";
import theme from "./theme";

function onError(error: Error) {
  console.error(error);
}

function Placeholder() {
  return <div className="text-gray overflow-hidden absolute text-ellipsis top-[15px] left-[10px] text-[15px] select-none inline-block pointer-events-none">
    Enter some rich text...
  </div>;
}

const Editor = () => {
  const initialConfig = {
    namespace: "editor",
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="mx-auto my-5 max-w-[600px] text-black relative leading-5 font-normal text-left rounded-t-lg">
        <ToolbarPlugin />
        <div className="bg-white relative">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
      {/* <HistoryPlugin />
      <AutoFocusPlugin />
      <ToolbarPlugin />
      <RichTextPlugin contentEditable={<ContentEditable />} placeholder={<Placeholder />} ErrorBoundary={LexicalErrorBoundary} /> */}
    </LexicalComposer>
  );
};

export default Editor;
