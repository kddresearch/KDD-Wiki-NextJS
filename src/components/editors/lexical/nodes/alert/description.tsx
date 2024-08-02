import { DecoratorNode, ElementNode, SerializedLexicalNode, TextNode } from "lexical";
import { ReactNode } from "react";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  ParagraphNode,
  RangeSelection,
  SerializedElementNode,
  SerializedTextNode,
  Spread,
  TabNode,
} from 'lexical';
import { $createAlertNode, $isAlertNode } from ".";

export type SerializedAlertNode = SerializedTextNode;

export class AlertDescriptionNode extends TextNode {

  static getType(): string {
    return 'alert-description';
  }

  static clone(node: AlertDescriptionNode): AlertDescriptionNode {
    return new AlertDescriptionNode(node.__text);
  }

  static importJSON(serializedNode: SerializedAlertNode): AlertDescriptionNode {
    const node = $createAlertDescriptionNode(serializedNode.text);
    return node;
  }

  constructor(text: string, key?: NodeKey,) {
    super(text, key);
  }

  // View
  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);

    const dom = document.createElement('div');
    dom.className = "text-sm [&_p]:leading-relaxed";
    dom.appendChild(element);

    return dom;
  }

  updateDOM(
    prevNode: AlertDescriptionNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const innerDOM = dom.firstElementChild as HTMLElement;
    const update = super.updateDOM(prevNode, innerDOM, config);

    // parent Must be an alert node
    const parent = this.getParent();

    if (!parent || !$isAlertNode(parent)) {
      console.warn('Alert Plugin: AlertNode not found, selection not retained. Please report this issue.');
      return update;
    }

    return update;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      version: 1,
    }
  }

  canHaveFormat(): boolean {
    return false;
  }
  
  setFormat(format: number): this {
    return this;
  }

  isParentRequired(): true {
    return true;
  }

  createParentElementNode(): ElementNode {
    return $createAlertNode();
  }
}

export function $createAlertDescriptionNode(text: string): AlertDescriptionNode {
  return new AlertDescriptionNode(text);
}

export function $isAlertDescriptionNode(
  node: LexicalNode | null | undefined,
): node is AlertDescriptionNode {
  return node instanceof AlertDescriptionNode;
}