import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useState } from "react";
import { getLinkStyling } from "../utils/styles";
import { $getSelection, $isRangeSelection } from "lexical";

export function EditLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isLinkEditorOpen, setIsLinkEditorOpen] = useState(false);

  const updateLinkEditor = useCallback(() => {
    const lexicalSelection = $getSelection();

    if (!$isRangeSelection(lexicalSelection)) {
      return;
    }

    const styling = getLinkStyling(lexicalSelection);

    if (styling.isDisabled) {
      return;
    }

    setIsLink(styling.isLink);
  }, [])

  editor.registerUpdateListener(() => {

  })

}