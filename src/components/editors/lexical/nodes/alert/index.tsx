import {
  $applyNodeReplacement,
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $isTextNode,
  DecoratorNode,
  ElementNode,
  SerializedLexicalNode,
  TextNode
} from "lexical";
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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Terminal } from "lucide-react";

import { alertVariants } from "@/components/ui/alert";
import { VariantProps } from "class-variance-authority";
import { $createAlertDescriptionNode, $isAlertDescriptionNode } from "./description";
import { $createAlertTitleNode } from "./title";


export type variant = VariantProps<typeof alertVariants>["variant"];

export type SerializedAlertNode = Spread<
  {
    title: string;
    description: string;
    variant: variant;
  },
  SerializedElementNode
>;

export class AlertNode extends ElementNode {
  __variant: variant;
  
  static getType(): string {
    return 'alert';
  }

  static clone(node: AlertNode): AlertNode {
    return new AlertNode(node.__variant, node.__key);
  }

  constructor(variant?: variant, key?: NodeKey) {
    super(key);
    this.__variant = variant || 'default';
  }

  // View
  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement('div');
    dom.className = alertVariants({ variant: this.__variant });
    dom.role = "alert";
    dom.dir = "ltr";

    // add svg icon
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', 'lucide lucide-info h-4 w-4');

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '12');
      circle.setAttribute('r', '10');
    svg.appendChild(circle);

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute('d', 'M12 16v-4');
    svg.appendChild(path1);

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute('d', 'M12 8h.01');
    svg.appendChild(path2);

    dom.appendChild(svg);

    return dom;
  }

  updateDOM(
    prevNode: AlertNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    return true;
  }

  insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | LexicalNode {
    // Create a new AlertDescriptionNode with a default text
    const latestNode = this.getLatest();
    const children = latestNode.getChildren()
    const childrenLength = children.length;

    if (
      childrenLength >= 2 &&
      selection.isCollapsed() &&
      selection.anchor.key === this.__key
    ) {
      // Breakout of the AlertNode

      const newElement = $createParagraphNode();
      this.insertAfter(newElement, restoreSelection);

      return newElement;
    }

    if (childrenLength === 0) {
      // Create a new AlertDescriptionNode with a default text
      const newElement = $createAlertTitleNode('\u200B');
      this.append(newElement);
      return null;
    }
  
    const {anchor, focus} = selection;

    const firstPoint = anchor.isBefore(focus) ? anchor : focus;
    const firstSelectionNode = firstPoint.getNode();

    if (!$isTextNode(firstSelectionNode)) {
      return null;
    }

    const nextSibling = firstSelectionNode.getNextSibling();

    if (
      (
        firstSelectionNode.getTextContentSize() === anchor.offset &&
        selection.isCollapsed() &&
        ($isAlertNode(nextSibling) || $isAlertDescriptionNode(nextSibling))
      ) ||
        !nextSibling
    ) {
      console.log('Inserting after 2');
      console.log('Content:', firstSelectionNode.getTextContent());
      console.log('more Content:', firstSelectionNode.getNextSibling());

      const newElement = $createAlertDescriptionNode('\u200B');

      firstSelectionNode.insertAfter(newElement);

      newElement.select(1, 1);
    }

    // if ($isAlertNode(firstSelectionNode)) {
    //   const {offset} = selection.anchor;
    //   firstSelectionNode.splice(offset, 0, [$createLineBreakNode()]);
    //   firstSelectionNode.select(offset + 1, offset + 1);
    // }
    // const newAlertDescriptionNode = $createAlertDescriptionNode('wtf');
    // this.append(newAlertDescriptionNode);
    // this.insertAfter(newAlertDescriptionNode, restoreSelection);
    return null;
  }

  collapseAtStart(): boolean {
    // const paragraph = $createParagraphNode();
    // const children = this.getChildren();
    // children.forEach((child) => paragraph.append(child));
    // this.replace(paragraph);
    // return true;

    return false;
  }
}




export function $createAlertNode(variant?: variant): AlertNode {
  return $applyNodeReplacement(new AlertNode(variant));
}

export function $isAlertNode(
  node: LexicalNode | null | undefined,
): node is AlertNode {
  return node instanceof AlertNode;
}

// export function $createAlertNode(title: string): AlertNode {
//   return new AlertNode();
// }

// export function $isAlertNode(node: LexicalNode | null | undefined): node is AlertNode {
//   return node instanceof AlertNode;
// }
