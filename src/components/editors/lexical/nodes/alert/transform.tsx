import {
  ElementTransformer
} from "@lexical/markdown";
import {
  $createAlertNode,
  $isAlertNode,
  AlertNode
} from "./root";
import { LexicalNode } from "lexical";
import { createBlockNode, isAlertVariant } from "./utils";

export const ALERT: ElementTransformer = {
  dependencies: [AlertNode],
  export: (node: LexicalNode) => {
    if (!$isAlertNode(node)) {
      return null;
    }
    const titleText = node.getTitle().toUpperCase().trim();
    const varientText = node.getVariant() === 'default' ? '' : '|' + node.getVariant();
    console.log('varientText', varientText, node.getVariant());
    const textContent = node.getDescription().split('\n').join('\n> ');
    return (
`
> [!${titleText}${varientText}]
> ${textContent}
`.trim()
    );
  },
  regExp: /^>[ \t]*\[!(\w+):(?:\|(\w+))?\]\s*\n((?:>.*(?:\n|$))*)/gm,
  replace: createBlockNode((match) => {
    const title = match ? match[1].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : undefined;
    const variant = isAlertVariant(match[2]) ? match[2] : undefined;
    const description = match ? match[3] : undefined;

    return $createAlertNode(title, description, variant);
  }),
  type: 'element',
};

