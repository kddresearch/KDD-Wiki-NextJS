import { $isListItemNode, $isListNode, ListItemNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getNodeBeforeRoot, hasSiblings, onlyChildIsListNode, listItemContainsListNode } from "../../utils";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";

function verifyIndent(node: ListItemNode, indent: number): boolean {
  let latestNode = node.getLatest();
  // console.log(`begin node ${latestNode.getKey()} | ${latestNode.getIndent()}`);

  const listNode = latestNode.getChildren().find($isListNode);
  const currentIndent = hasSiblings(latestNode) ? indent + 1 : indent;

  if (listNode) {
    const result = listNode.getChildren()
      .filter($isListItemNode)
      .sort(sortListItemsByListNodes)
      .every((child) => {

      // console.log(`node ${child.getKey()} has a list node | siblings: ${hasSiblings(child)} | indent: ${currentIndent}`);
      return verifyIndent(child, currentIndent);
    });
    return result;
  } else {
    // console.log(`end   node ${latestNode.getKey()} | ${indent}`);

    if (latestNode.getIndent() !== indent) {
      console.log(`node ${latestNode.getKey()} has an incorrect indent | expected: ${indent} | actual: ${latestNode.getIndent()}`);
      latestNode.setIndent(indent);
    }

    return true;
  }

  // Recursive Case

  // Default Case
  if (!listItemContainsListNode(latestNode)) {
    // console.log(`node ${latestNode.getKey()} is a leaf node`);
    console.log(`end   node ${latestNode.getKey()} | ${indent}`);
    return true;
  }


  // Error Case
  if (!listNode) {
    console.warn('list node not found, please report this issue to the developers');
    return false;
  }

  console.log(`node ${latestNode.getKey()} has a list node | siblings: ${hasSiblings(latestNode)} | indent: ${currentIndent}`);

}

function sortListItemsByListNodes(a: ListItemNode, b: ListItemNode): number {
  return listItemContainsListNode(a) ?
    listItemContainsListNode(b) ? 0
    : -1
  : listItemContainsListNode(b) ? 1
    : 1
}

export function PreventOrphanedIndentsPlugin() {
  const [editor] = useLexicalComposerContext();

  editor.registerNodeTransform(ListNode, (node) => {
    const rootListNode = getNodeBeforeRoot<ListNode>(node, ListNode);

    // if (rootListNode.getKey() !== node.getKey()) {
    //   return;
    // }

    const childrenSize = rootListNode.getChildrenSize();
    const children = rootListNode.getChildren();

    console.log("root list", rootListNode.getKey());

    if (childrenSize === 0) {
      return;
    }

    const result = children.filter($isListItemNode)
      .sort(sortListItemsByListNodes)
      .every((child) => {
        const indent = 0;
        return verifyIndent(child, indent);
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