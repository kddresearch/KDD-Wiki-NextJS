import { $isListItemNode, $isListNode, ListItemNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getNodeBeforeRoot } from "../../utils";

function verifyIndent(node: ListItemNode, indent: number): boolean {
  const children = node.getChildren();
  const isOnlyListChildren = children.every($isListNode);

  const listChildren = node.getChildren().filter($isListNode);
  const childrenSize = node.getChildrenSize();
  const currentIndent = node.getIndent();

  console.log('indent', indent);
  console.log('currentIndent', currentIndent);

  if (currentIndent > indent) {
    node.setIndent(indent);
  }

  // const nextIndent = isOnlyListChildren ? indent : indent + 1;
  const nextIndent = indent + 1;

  if (childrenSize === 0) {
    // Base Case
    return true;
  }

  listChildren.forEach((listChild) => {
    const children = listChild.getChildren().filter($isListItemNode);
    children.forEach((child) => {
      verifyIndent(child, nextIndent);
    });
  })

  return true;
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

    children.forEach((child, index) => {
      const indent = 0;

      if ($isListItemNode(child)) {
        const result = verifyIndent(child, indent);
        return result;
      } else {
        console.warn('child is not a ListItemNode, please report this issue to the developers');
      }
    });
  })

  return (
    <></>
  )
}