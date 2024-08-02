import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  ElementNode,
} from "lexical";
import type {
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
} from 'lexical';
import {
  $createAlertNode,
  $isAlertNode
} from "./root";
import { $createAlertDescriptionNode } from "./description";

export class AlertTitleNode extends ElementNode {
  static getType(): 'alert-title' {
    return 'alert-title';
  }

  static clone(node: AlertTitleNode): AlertTitleNode {
    return new AlertTitleNode(node.__key);
  }

  static importJSON(serializedNode: SerializedElementNode): AlertTitleNode {
    const node = $createAlertTitleNode();
    return node;
  }

  static transform(): ((node: LexicalNode) => void) | null {
    return (node: LexicalNode) => {
      const parent = node.getParentOrThrow();

      if ($isAlertNode(parent)) {
        return;
      }

      if (node.isAttached()) {
        return;
      }

      node.replace($createTextNode(node.getTextContent()));
    };
  }

  collapseAtStart(): true {
    const selection = $getSelection();

    console.log("running Title Collapse");

    const newElement = !this.isEmpty()
      ? $createAlertTitleNode()
      : $createParagraphNode();
    const children = this.getChildren();
    const parent = this.getParent();

    if (!$isRangeSelection(selection)) {
      return true;
    }

    if (!$isAlertNode(parent)) {
      return true;
    }

    const [x, y] = selection.getStartEndPoints()?.map((point) => point.offset) ?? [0, 0];

    if (x !== 0 || y !== 0) {
      return true;
    }

    children.forEach((child) => newElement.append(child));
    const updatedParent = parent.replace(newElement);
    updatedParent.selectStart();
    return true;
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  // View
  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement('h5');
    dom.className = "mb-1 font-semibold leading-none tracking-tight text-lg";

    return dom;
  }

  updateDOM(
    prevNode: AlertTitleNode,
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
    
    const anchorOffet = selection ? selection.anchor.offset : 0;
    const newElement = $createAlertDescriptionNode();

    const direction = this.getDirection();
    newElement.setDirection(direction);
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

  getTextContent(): string {
    const children = this.getChildren();
    return children.reduce((acc, child) => acc + child.getTextContent() + '\n', '');
  }

  isParentRequired(): true {
    return true;
  }

  createParentElementNode(): ElementNode {
    return $createAlertNode();
  }
}

export function $createAlertTitleNode(text?: string): AlertTitleNode {
  if (text === undefined) {
    return new AlertTitleNode();
  }

  return new AlertTitleNode().append($createTextNode(text));
}

export function $isAlertTitleNode(
  node: LexicalNode | null | undefined,
): node is AlertTitleNode {
  return node instanceof AlertTitleNode;
}
