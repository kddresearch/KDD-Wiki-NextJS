import {
  ElementTransformer
} from "@lexical/markdown";
import {
  $createAlertNode,
  $isAlertNode,
  AlertNode
} from "./root";
import { $createLineBreakNode, $createTextNode, $isTextNode, LexicalNode } from "lexical";
import { createBlockNode, isAlertVariant } from "./utils";
import { $createQuoteNode, $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import { $createAlertDescriptionNode, $isAlertDescriptionNode, AlertDescriptionNode } from "./description";
import { $createAlertTitleNode } from "./title";

export const ALERT: ElementTransformer = {
  dependencies: [AlertNode],
  export: (node, exportChildren) => {
    if (!$isAlertNode(node)) {
      return null;
    }
    console.log('exporting Children', exportChildren(node));

    const titleText = node.getTitle().toUpperCase().trim();
    const titleNode = node.getTitleNode();

    if (!titleNode) {
      return null;
    }

    const titleContent = exportChildren(titleNode).toUpperCase().trim();
    const varientText = node.getVariant() === 'default' ? '' : '|' + node.getVariant();
    const textContent = node.getDescription().split('\n').join('\n> ');
    const descriptionNodes = node.getDescriptionNodes();
    const descriptionContent = descriptionNodes.map((node) => {
      return exportChildren(node);
    }).join('\n> ');

    return (
`
> [!${titleContent}${varientText}]
> ${descriptionContent}
`.trim()
    );
  },
  // regExp: /^>[ \t]*\[!(\w+):(?:\|(\w+))?\]\s*\n((?:>.*(?:\n|$))*)/gm, // TODO: Add support for multiple lines in Lexical  regExp: /^>[ \t]*\[!([a-zA-Z\s]+):(?:\|(\w+))?\]/,
  regExp: /^>[ \t]*\[!([a-zA-Z\s\*{1}~{2}==]+):(?:\|(\w+))?\]/,
  replace: (parentNode, children, _match, isImport) => {
    const variant = isAlertVariant(_match[2]) ? _match[2] : undefined;
    const node = $createAlertNode(variant);

    const textChildren = [...children].filter((value) => $isTextNode(value));

    if (textChildren.length > 1) {
      console.warn('There should only be one text node, something is going wrong here');
    }

    const titleContent = `${_match[1]}:`.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    console.log('titleContent', titleContent);

    const titleNode = $createAlertTitleNode();
    titleNode.append(textChildren[0].setTextContent(titleContent));
    node.append(titleNode);
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
          const descriptionNode = $createAlertDescriptionNode();
          descriptionNode.append(child);

          return descriptionNode.getLatest();
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

