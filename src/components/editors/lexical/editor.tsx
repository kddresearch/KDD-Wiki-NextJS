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
  return <div className="text-lightgray overflow-hidden absolute text-ellipsis top-[15px] left-[10px] text-normal select-none inline-block pointer-events-none">
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
      <div className="my-5 text-black relative leading-5 font-normal text-left rounded-t-lg border-gray border rounded-b-lg">
        <ToolbarPlugin />
        <div className="bg-white relative">
          <RichTextPlugin contentEditable={<ContentEditable className="min-h-[150px] resize-none text-[15px] caret-[#444)] relative tab-[1] outline-none p-[15px_10px] caret-[#444]" />} placeholder={<Placeholder />} ErrorBoundary={LexicalErrorBoundary}/>
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;
