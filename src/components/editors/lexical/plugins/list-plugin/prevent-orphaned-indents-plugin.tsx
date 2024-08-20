import { $isListItemNode, $isListNode, ListItemNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeBeforeRoot, hasSiblings, onlyChildIsListNode, listItemContainsListNode } from "../../utils";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";

function sortListItemsByListNodes(a: ListItemNode, b: ListItemNode): number {
  return listItemContainsListNode(a) ?
    listItemContainsListNode(b) ? 0
    : -1
  : listItemContainsListNode(b) ? 1
    : 1
}

function verifyIndent(node: ListItemNode, indent: number, maxDepth: number): boolean {
  const latestNode = node.getLatest();
  const listNode = latestNode.getChildren().find($isListNode);
  const currentIndent = hasSiblings(latestNode) ? indent + 1 : indent;

  if (listNode) {
    const result = listNode.getChildren()
      .filter($isListItemNode)
      .sort(sortListItemsByListNodes)
      .every((child) => {
        return verifyIndent(child, currentIndent, maxDepth);
      });
    return result;
  } else {
    if (indent > maxDepth) {
      console.warn(`node ${latestNode.getKey()} has an indent greater than ${maxDepth} | indent: ${indent}`);
      indent = maxDepth;
    }

    if (latestNode.getIndent() !== indent) {
      latestNode.setIndent(indent);
    }

    return true;
  }
}


export function PreventOrphanedIndentsPlugin({
  maxDepth = 7
}: {
  maxDepth?: number;
}) {
  const [editor] = useLexicalComposerContext();

  editor.registerNodeTransform(ListNode, (node) => {
    const rootListNode = $getNodeBeforeRoot<ListNode>(node, ListNode);
    const childrenSize = rootListNode.getChildrenSize();
    const children = rootListNode.getChildren();

    if (childrenSize === 0) {
      return;
    }

    const result = children.filter($isListItemNode)
      .sort(sortListItemsByListNodes)
      .every((child) => {
        const indent = 0;
        return verifyIndent(child, indent, maxDepth);
      });

    if (!result) {
      console.warn('Something went wrong when verifying the indent of the list items');
      return;
    }

    return;
  })

  return (
    <></>
  )
}