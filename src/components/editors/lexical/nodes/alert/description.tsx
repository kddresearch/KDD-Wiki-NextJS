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
  Spread,
  TabNode,
} from 'lexical';

import { InfoIcon, Terminal } from "lucide-react";

import { alertVariants } from "@/components/ui/alert";
import { $createAlertNode } from ".";


export type variant = "default" | "destructive" | null | undefined;

export type SerializedAlertNode = Spread<
  {
    title: string;
    description: string;
    variant: variant;
  },
  SerializedElementNode
>;

export class AlertDescriptionNode extends TextNode {

  static getType(): string {
    return 'alert-description';
  }

  static clone(node: AlertDescriptionNode): AlertDescriptionNode {
    return new AlertDescriptionNode(node.__text);
  }

  constructor(description: string) {
    super(description);
  }

  // View
  createDOM(config: EditorConfig): HTMLElement {
    // Define the DOM element here

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

    return update;
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

export function $createAlertDescriptionNode(description: string): AlertDescriptionNode {
  return new AlertDescriptionNode(description);
}

export function $isAlertDescriptionNode(
  node: LexicalNode | null | undefined,
): node is AlertDescriptionNode {
  return node instanceof AlertDescriptionNode;
}