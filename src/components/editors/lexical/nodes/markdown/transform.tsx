import {
  ElementTransformer
} from "@lexical/markdown";
import {
  $isMakrdownEditorCodeNode,
  MakrdownEditorCodeNode,
} from "./root";
import { LexicalNode } from "lexical";

export const MARKDOWN_EDITOR: ElementTransformer = {
  dependencies: [MakrdownEditorCodeNode],
  export: (node: LexicalNode) => {
    if (!$isMakrdownEditorCodeNode(node)) {
      return null;
    }
    const textContent = node.getTextContent();
    return (
`${textContent}`.trim()
    );
  },
  regExp: /a^/,
  replace: (parentNode, children, _match, isImport) => {
    throw new Error('Not implemented, this should never match');
  },
  type: 'element',
};
  