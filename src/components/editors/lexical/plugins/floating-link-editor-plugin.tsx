import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_HIGH, COMMAND_PRIORITY_LOW, KEY_ESCAPE_COMMAND, LexicalEditor, SELECTION_CHANGE_COMMAND } from "lexical"
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { getSelectedNode } from "../utils";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "@lexical/link";


function FloatingLinkEditorPlugin({
  editor,
  isLink,
  setIsLink,
  anchorElem,
}: {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://');

  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }

    
    const editorElem = editorRef.current;
    const rootElement = editor.getRootElement();
    
    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, $updateLinkEditor, setIsLink, isLink]);



  return (
    <div>

    </div>
  )
}