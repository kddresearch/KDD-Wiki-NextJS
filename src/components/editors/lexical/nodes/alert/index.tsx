import {
  $applyNodeReplacement,
  $createParagraphNode,
  $createTextNode,
  $isRootNode,
  $isTextNode,
  ElementNode,
} from "lexical";
import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from 'lexical';
import { alertVariants } from "@/components/ui/alert";
import { VariantProps } from "class-variance-authority";
import { $createAlertDescriptionNode, $isAlertDescriptionNode } from "./description";
import { $alertNodeTransform } from "./utils";
import { $createAlertTitleNode } from "./title";


export type variant = VariantProps<typeof alertVariants>["variant"];

export type SerializedAlertNode = Spread<
  {
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

  static importJSON(serializedNode: SerializedAlertNode): AlertNode {

    const aleartTitle = serializedNode.children.map((child) => {
      if (child.type === 'alert-title') {
        return $createAlertTitleNode();
      }
      return null;
    })[0];

    if (!aleartTitle) {
      return $createAlertNode();
      // throw new Error("AlertNode must have an AlertTitleNode");
    }

    const node = $createAlertNode(aleartTitle.getTextContent(), serializedNode.variant);
    return node;
  }

  static transform(): ((node: LexicalNode) => void) | null {
    return (node: LexicalNode) => {
      if (!$isAlertNode(node)) {
        return;
      }

      const parent = node.getParentOrThrow();

      if (parent === null) {
        const paragraphNode = $createParagraphNode();
        node.replace(paragraphNode);
        return;
      }

      if (!$isRootNode(parent)) {
        return;
      }

      if (!$isAlertNode(node)) {
        return;
      }
      $alertNodeTransform(node);
    };
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
    // Update the DOM element here
    const update = (prevNode.getVariant() !== this.getVariant()) || 
      (prevNode.__key !== this.__key) || 
      (this.getChildrenSize() === 0)
    ;

    return update;
  }

  canBreakout(selection: RangeSelection): boolean {
    const latestNode = this.getLatest();
    const childrenLength = latestNode.getChildrenSize();
    const lastChild = latestNode.getLastChild();

    if (!lastChild) {
      return false;
    }

    const secondLastChild = lastChild.getPreviousSibling();

    if (!secondLastChild) {
      return false;
    }

    const arePast2ChildrenEmpty =
      lastChild.getTextContentSize() === 0 &&
      secondLastChild.getTextContentSize() === 0
    ;

    return childrenLength >= 2 && selection.isCollapsed() && arePast2ChildrenEmpty;
  }

  insertNewAfter(selection: RangeSelection, restoreSelection?: boolean): null | LexicalNode {
    // Create a new AlertDescriptionNode with a default text
    const latestNode = this.getLatest();

    console.log("checking Breakout");

    if (this.canBreakout(selection)) {
      // Breakout of the AlertNode

      let currentNode = latestNode.getLastChild()!;
      while (true) {
        currentNode.remove();

        const previousSibling = currentNode.getPreviousSibling();

        if (!previousSibling) {
          break;
        }

        if (previousSibling.getTextContentSize() != 0) {
          break;
        }
        currentNode = previousSibling;
      }

      const newElement = $createParagraphNode();
      this.insertAfter(newElement, restoreSelection);

      return newElement;
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
    return null;
  }

  getVariant(): variant {
    return this.__variant;
  }

  collapseAtStart(): boolean {

    console.log("running Alert Collapse");

    return true;
  }

  exportJSON(): SerializedAlertNode {
    return {
      ...super.exportJSON(),
      variant: this.__variant,
      type: this.getType(),
      version: 1,
    };
  }

  getTextContent(): string {
    const children = this.getChildren();
    return children.reduce((acc, child) => acc + child.getTextContent() + '\n', '');
  }

  getTextContentSize(): number {
    const children = this.getChildren();
    return children.reduce((acc, child) => acc + child.getTextContentSize(), 0);
  }
}

export function $createAlertNode(title?: string, variant?: variant): AlertNode {

  if (title === undefined) {
    title = 'Note:';
  }

  return $applyNodeReplacement(
    (new AlertNode(variant))
      .append($createAlertTitleNode(title))
  );
}

export function $isAlertNode(
  node: LexicalNode | null | undefined,
): node is AlertNode {
  return node instanceof AlertNode;
}