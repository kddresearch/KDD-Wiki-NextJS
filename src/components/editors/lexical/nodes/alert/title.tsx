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
import { $createAlertNode } from ".";

export type SerializedAlertTitleNode = SerializedTextNode;

export class AlertTitleNode extends TextNode {
  
  static getType(): string {
    return 'alert-title';
  }

  static clone(node: AlertTitleNode): AlertTitleNode {
    return new AlertTitleNode(node.__text);
  }

  static importJSON(serializedNode: SerializedAlertTitleNode): AlertTitleNode {
    const node = $createAlertTitleNode(serializedNode.text);
    return node;
  }

  constructor(text: string, key?: NodeKey,) {
    super(text, key);
  }

  // View
  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);

    const wrapper = document.createElement('h5');
    wrapper.className = "mb-1 font-semibold leading-none tracking-tight text-lg";
    wrapper.appendChild(element);

    return wrapper;
  }

  updateDOM(
    prevNode: AlertTitleNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const innerDOM = dom.firstElementChild as HTMLElement;
    const update = super.updateDOM(prevNode, innerDOM, config);

    return update;
  }

  exportJSON(): SerializedAlertTitleNode {
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

export function $createAlertTitleNode(text: string): AlertTitleNode {
  return new AlertTitleNode(text);
}

export function $isAlertTitleNode(
  node: LexicalNode | null | undefined,
): node is AlertTitleNode {
  return node instanceof AlertTitleNode;
}