import { $createTextNode, $getNodeByKey, $getSelection, $isLineBreakNode, $isRangeSelection, $isTextNode, LexicalEditor, LexicalNode, NodeKey, TextNode } from "lexical";
import { $isAlertNode, AlertNode } from ".";
import { $createAlertTitleNode, $isAlertTitleNode, AlertTitleNode } from "./title";
import { $createAlertDescriptionNode, $isAlertDescriptionNode, AlertDescriptionNode } from "./description";
import { mergeRegister } from "@lexical/utils";

export function registerAlertNodeTransforms(editor: LexicalEditor) {
  if (!editor.hasNodes([AlertNode, AlertTitleNode, AlertDescriptionNode])) {
    throw new Error(
      'Alert Plugin: AlertNode, AlertTitleNode, or AlertDescriptionNode not registered on the editor',
    );
  }

  return mergeRegister(
    editor.registerNodeTransform(TextNode, (node) => {
      // $textNodeTransform(node, editor);
      $textNodeTransform(node);
    })
  )
}

export function $alertNodeTransform(
  node: AlertNode,
) {
  console.log("This is running the alert node transform");

  const nodeKey = node.getKey();

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const currentNode = $getNodeByKey(nodeKey);
  if (!$isAlertNode(currentNode) || !currentNode.isAttached()) {
    return;
  }

  const alertContext = currentNode.getTextContent();
  const children = currentNode.getChildren();


  if (children.length >= 1 && children[0].getType() === 'text') {
    node.splice(0, node.getChildren().length, [
      $createAlertTitleNode(alertContext),
    ]);

    const alertTitleRef = currentNode.getLatest().getChildAtIndex(0);

    if (!$isAlertTitleNode(alertTitleRef)) {
      console.warn('Alert Plugin: AlertTitleNode not found, selection not retained. Please report this issue.');
      return;
    }

    alertTitleRef.select(alertTitleRef.getTextContentSize(), alertTitleRef.getTextContentSize());

    return;
  }

  children.forEach((child) => {
    child = child.getLatest();
    const textContent = child.getTextContent();
    const previousSibling = child.getPreviousSibling();

    if ($isAlertDescriptionNode(child) && textContent.length >= 1) {
      // look for \u200B and remove it

      textContent.replace(/\u200B/g, '');
      child.setTextContent(textContent);
    }

    if (child.getType() != 'text') {
      return;
    }

    const updatedChild = child.replace($createAlertDescriptionNode(child.getTextContent())).getLatest();
    const nextSibling = updatedChild.getNextSibling();

    // Do not lose selection
    updatedChild.selectEnd();

    if (!nextSibling) {
      return;
    }

    nextSibling.selectStart();

    if ($isAlertTitleNode(child) && previousSibling) {
      console.log("This is running 22");

      if (!(child.getType() != 'text')) {
        return;
      }
    }
  });
  return;
}

export function $textNodeTransform(
  node: TextNode,
): void {
  const parent = node.getParent();
  if ($isAlertNode(parent)) {
    $alertNodeTransform(parent);
  } else if ($isAlertTitleNode(parent) || $isAlertDescriptionNode(parent)) {
    node.replace($createTextNode(node.__text));
  }
}
