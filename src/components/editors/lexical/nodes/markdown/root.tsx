import { $createCodeHighlightNode, $isCodeHighlightNode, $isCodeNode, CodeHighlightNode, CodeNode, getFirstCodeNodeOfLine, SerializedCodeNode } from "@lexical/code";
import { $createLineBreakNode, $createTabNode, $createTextNode, $isParagraphNode, $isTabNode, $isTextNode, ParagraphNode, RangeSelection, Spread, TabNode } from "lexical";

export type SerializedMakrdownEditorCodeNode = Spread<
  SerializedCodeNode,
  {

  }
>;

export class MakrdownEditorCodeNode extends CodeNode {
  static getType(): string {
    return 'markdown-editor';
  }

  static clone(node: MakrdownEditorCodeNode): MakrdownEditorCodeNode {
    return new MakrdownEditorCodeNode(node.__language, node.__key);
  }

  static importJSON(serializedNode: any): MakrdownEditorCodeNode {
    return new MakrdownEditorCodeNode();
  }

  // canInsertTextAfter(): boolean {
  //   return false;
  // }

  // canInsertTextBefore(): boolean {
  //   return false;
  // }

  /**
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
  **/

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection = true,
  ): null | ParagraphNode | CodeHighlightNode | TabNode {
    const children = this.getChildren();
    const childrenLength = children.length;

    // if (
    //   childrenLength >= 2 &&
    //   children[childrenLength - 1].getTextContent() === '\n' &&
    //   children[childrenLength - 2].getTextContent() === '\n' &&
    //   selection.isCollapsed() &&
    //   selection.anchor.key === this.__key &&
    //   selection.anchor.offset === childrenLength
    // ) {
    //   children[childrenLength - 1].remove();
    //   children[childrenLength - 2].remove();
    //   const newElement = $createParagraphNode();
    //   this.insertAfter(newElement, restoreSelection);
    //   return newElement;
    // }

    // If the selection is within the codeblock, find all leading tabs and
    // spaces of the current line. Create a new line that has all those
    // tabs and spaces, such that leading indentation is preserved.
    const {anchor, focus} = selection;
    const firstPoint = anchor.isBefore(focus) ? anchor : focus;
    const firstSelectionNode = firstPoint.getNode();
    if ($isTextNode(firstSelectionNode)) {
      let node = getFirstCodeNodeOfLine(firstSelectionNode);
      const insertNodes = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if ($isTabNode(node)) {
          insertNodes.push($createTabNode());
          node = node.getNextSibling();
        } else if ($isCodeHighlightNode(node)) {
          let spaces = 0;
          const text = node.getTextContent();
          const textSize = node.getTextContentSize();
          while (spaces < textSize && text[spaces] === ' ') {
            spaces++;
          }
          if (spaces !== 0) {
            insertNodes.push($createCodeHighlightNode(' '.repeat(spaces)));
          }
          if (spaces !== textSize) {
            break;
          }
          node = node.getNextSibling();
        } else {
          break;
        }
      }
      const split = firstSelectionNode.splitText(anchor.offset)[0];
      const x = anchor.offset === 0 ? 0 : 1;
      const index = split.getIndexWithinParent() + x;
      const codeNode = firstSelectionNode.getParentOrThrow();
      const nodesToInsert = [$createLineBreakNode(), ...insertNodes];
      codeNode.splice(index, 0, nodesToInsert);
      const last = insertNodes[insertNodes.length - 1];
      if (last) {
        last.select();
      } else if (anchor.offset === 0) {
        split.selectPrevious();
      } else {
        split.getNextSibling()!.selectNext(0, 0);
      }
    }
    if ($isCodeNode(firstSelectionNode)) {
      const {offset} = selection.anchor;
      firstSelectionNode.splice(offset, 0, [$createLineBreakNode()]);
      firstSelectionNode.select(offset + 1, offset + 1);
    }

    return null;
  }
}

export function $createMakrdownEditorCodeNode(content: string): MakrdownEditorCodeNode {
  return new MakrdownEditorCodeNode("markdown")
    .append($createTextNode(content));
}

export function $isMakrdownEditorCodeNode(node: any): node is MakrdownEditorCodeNode {
  return node instanceof MakrdownEditorCodeNode;
}