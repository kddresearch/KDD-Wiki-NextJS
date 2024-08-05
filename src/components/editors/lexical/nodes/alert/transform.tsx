import {
  ElementTransformer
} from "@lexical/markdown";
import {
  $createAlertNode,
  $isAlertNode,
  AlertNode
} from "./root";
import { $createLineBreakNode, $isTextNode, LexicalNode } from "lexical";
import { createBlockNode, isAlertVariant } from "./utils";
import { $createQuoteNode, $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import { $createAlertDescriptionNode, AlertDescriptionNode } from "./description";

export const ALERT: ElementTransformer = {
  dependencies: [AlertNode],
  export: (node: LexicalNode) => {
    if (!$isAlertNode(node)) {
      return null;
    }
    const titleText = node.getTitle().toUpperCase().trim();
    const varientText = node.getVariant() === 'default' ? '' : '|' + node.getVariant();
    const textContent = node.getDescription().split('\n').join('\n> ');
    return (
`
> [!${titleText}${varientText}]
> ${textContent}
`.trim()
    );
  },
  // regExp: /^>[ \t]*\[!(\w+):(?:\|(\w+))?\]\s*\n((?:>.*(?:\n|$))*)/gm, // TODO: Add support for multiple lines in Lexical
  regExp: /^>[ \t]*\[!(\w+):(?:\|(\w+))?\]/,
  replace: (parentNode, children, _match, isImport) => {
    const variant = isAlertVariant(_match[2]) ? _match[2] : undefined;
    const node = $createAlertNode(_match[1], undefined, variant);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  },
  type: 'element',
};

export const QUOTE_OR_ALERT_DESCRIPTION: ElementTransformer = {
  dependencies: [QuoteNode, AlertDescriptionNode],
  export: (node, exportChildren) => {
    if (!$isQuoteNode(node)) {
      return null;
    }

    const lines = exportChildren(node).split('\n');
    const output = [];
    for (const line of lines) {
      output.push('> ' + line);
    }
    return output.join('\n');
  },
  regExp: /^>\s/,
  replace: (parentNode, children, _match, isImport) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling();

      if ($isAlertNode(previousNode)) {
        const alertDescriptions = [...children].filter((value) => $isTextNode(value)).map((child) => {
          return $createAlertDescriptionNode(child.getTextContent());
        })

        previousNode.splice(previousNode.getChildrenSize(), 0, [
          ...alertDescriptions,
        ]);
        previousNode.select(0, 0);
        parentNode.remove();
        return
      }

      if ($isQuoteNode(previousNode)) {
        previousNode.splice(previousNode.getChildrenSize(), 0, [
          $createLineBreakNode(),
          ...children,
        ]);
        previousNode.select(0, 0);
        parentNode.remove();
        return;
      }
    }

    const node = $createQuoteNode();
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  },
  type: 'element',
};

