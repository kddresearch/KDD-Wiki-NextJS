import {
  $createParagraphNode,
  $createTextNode,
  ElementNode
} from "lexical";
import type {
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode
} from 'lexical';
import {
  $createAlertNode,
  $isAlertNode
} from "./root";
import { $createAlertTitleNode } from "./title";

export class AlertDescriptionNode extends ElementNode {
  static getType(): string {
    return 'alert-description';
  }

  static clone(node: AlertDescriptionNode): AlertDescriptionNode {
    return new AlertDescriptionNode(node.__key);
  }

  static importJSON(serializedNode: SerializedElementNode): AlertDescriptionNode {
    const node = $createAlertDescriptionNode();
    return node;
  }

  static transform(): ((node: LexicalNode) => void) | null {
    return (node: LexicalNode) => {
      if (!$isAlertDescriptionNode(node)) {
        node.replace($createTextNode(node.getTextContent()));
        return;
      }

      // Outside of AlertNode
      const parent = node.getParent();
      if (!$isAlertNode(parent)) {
        node.replace($createTextNode(node.getTextContent()));
        return;
      }

      if (node.getIndexWithinParent() === 0) {
        const titleNode = node.replace($createAlertTitleNode(node.getTextContent()));
        titleNode.getLatest().selectStart();
        return;
      }
    };
  }

  constructor(key?: NodeKey,) {
    super(key);
  }

  // View
  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {

    const dom = document.createElement('div');
    dom.className = "text-sm [&_p]:leading-relaxed";

    return dom;
  }

  updateDOM(
    prevNode: AlertDescriptionNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const update = (prevNode.__key !== this.__key) || 
      (this.getChildrenSize() === 0)
    ;

    return update;
  }

  insertNewAfter(
    selection?: RangeSelection,
    restoreSelection = true,
  ): null | LexicalNode {

    if (!selection) {
      return null;
    }

    const newElement = $createAlertDescriptionNode();

    const alertNode = this.getParentOrThrow();

    if (!$isAlertNode(alertNode)) {
      console.warn('AlertDescriptionNode: AlertNode not found, selection not retained. Please report this issue.');

      return null;
    }

    const canBreakout = alertNode.canBreakout(selection);

    // const direction = this.getDirection();
    // newElement.setDirection(direction);
    if (canBreakout) {
      const paragraph = $createParagraphNode();
      alertNode.insertAfter(paragraph, restoreSelection);

      const latestNode = alertNode.getLatest();
      let currentNode = latestNode.getLastChild()!;
      while (true) {
        const previousSibling = currentNode.getPreviousSibling();

        currentNode.remove();

        if (!previousSibling) {
          break;
        }

        if (previousSibling.getTextContentSize() != 0) {
          break;
        }
        currentNode = previousSibling;
      }

      paragraph.getLatest().select();
      return null;
    }

    this.insertAfter(newElement, restoreSelection);
    return newElement;
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      version: 1,
    }
  }

  isParentRequired(): true {
    return true;
  }

  createParentElementNode(): ElementNode {
    return $createAlertNode();
  }
}

export function $createAlertDescriptionNode(text?: string): AlertDescriptionNode {

  if (text === undefined) {
    return new AlertDescriptionNode();
  }

  // split text by new line
  const lines = text.split('\n');
  const result = lines.reduce((acc, line, index) => {
    if (index === 0) {
      return acc.append($createTextNode(line));
    }

    return acc.append($createParagraphNode().append($createTextNode(line)));
  }, new AlertDescriptionNode());

  return result;
}

export function $isAlertDescriptionNode(
  node: LexicalNode | null | undefined,
): node is AlertDescriptionNode {
  return node instanceof AlertDescriptionNode;
}