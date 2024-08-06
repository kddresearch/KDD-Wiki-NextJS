import { $isListItemNode, $isListNode, ListItemNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getNodeBeforeRoot, hasSiblings, onlyChildIsListNode, listItemContainsListNode } from "../../utils";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";

function verifyIndent(node: ListItemNode, indent: number): boolean {
  let latestNode = node.getLatest();

  // Default Case
  if (!listItemContainsListNode(latestNode)) {
    latestNode.setIndent(indent);
    // console.log(`node ${latestNode.getKey()} is a leaf node`);
    return true;
  }

  const listNode = latestNode.getChildren().find($isListNode);

  // Error Case
  if (!listNode) {
    console.warn('list node not found, please report this issue to the developers');
    return false;
  }

  const currentIndent = hasSiblings(latestNode) ? indent + 1 : indent;
  console.log(`node ${latestNode.getKey()} has a list node`);
  console.log(`siblings: ${hasSiblings(latestNode)}`);
  console.log(`current indent: ${currentIndent}`);
  console.log();

  // Recursive Case
  return listNode.getChildren().filter($isListItemNode).every((child) => {
    const result = verifyIndent(child, currentIndent);
    return result;
  });
}

export function PreventOrphanedIndentsPlugin() {
  const [editor] = useLexicalComposerContext();

  editor.registerNodeTransform(ListNode, (node) => {
    const rootListNode = getNodeBeforeRoot<ListNode>(node, ListNode);

    const childrenSize = rootListNode.getChildrenSize();
    const children = rootListNode.getChildren();

    console.log("root list", rootListNode.getKey());

    if (childrenSize === 0) {
      return;
    }

    const result = children.every((child) => {
      const indent = 0;

      if ($isListItemNode(child)) {
        const result = verifyIndent(child, indent);
        return result;
      } else {
        console.warn('child is not a ListItemNode, please report this issue to the developers');
      }
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