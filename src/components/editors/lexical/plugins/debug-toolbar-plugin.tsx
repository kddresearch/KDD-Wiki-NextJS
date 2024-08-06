import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";
import { KDD_TRANSFORMERS } from "./markdown-plugin/transform";
import { $convertFromMarkdownString, $convertToMarkdownString } from "@lexical/markdown";
import { Button } from "@/components/ui/button";
import { $createTextNode, $getRoot } from "lexical";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { TOGGLE_DIRECT_MARKDOWN_COMMAND } from "./markdown-plugin";

export default function DebugToolbar() {
  const [editor] = useLexicalComposerContext();

  const handleConvertToMarkdown = () => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(KDD_TRANSFORMERS);
      console.log(markdown);
    });
  };

  const throwError = () => {
    throw new Error("Failed to parse Markdown");
  }

  const throwLexicalError = () => {
    editor.update(() => {
      throw new Error("Failed to parse Markdown");
    });
  }

  const handleMarkdownToggle = () => {
    editor.dispatchCommand(TOGGLE_DIRECT_MARKDOWN_COMMAND, undefined);
  }

  return (
    <>
      <div className="border-t border-gray mx-1">
        <div className="flex bg-white py-1 rounded-t-lg align-middle text-darkgray h-12 gap-1" >
          <Button onClick={handleConvertToMarkdown} variant={"outline"}>Convert to Markdown</Button>
          <Button onClick={throwError} variant={"destructive"}>Throw Error</Button>
          <Button onClick={throwLexicalError} variant={"destructive"}>Throw Lexical Error</Button>
          <Button onClick={handleMarkdownToggle} variant={"outline"}>Convert to Markdown and Replace</Button>
        </div>
      </div>

      <TreeView
        viewClassName="tree-view-output"
        treeTypeButtonClassName="debug-treetype-button"
        timeTravelPanelClassName="debug-timetravel-panel"
        timeTravelButtonClassName="debug-timetravel-button"
        timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
        timeTravelPanelButtonClassName="debug-timetravel-panel-button"
        editor={editor}
      />
    </>
  )
}
