import {
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  TextNode
} from "lexical";
import {
  $isAlertNode,
  AlertNode
} from ".";
import {
  $createAlertTitleNode,
  $isAlertTitleNode,
} from "./title";
import {
  $createAlertDescriptionNode,
  $isAlertDescriptionNode,
} from "./description";

export function $alertNodeTransform(
  node: AlertNode,
) {
  const nodeKey = node.getKey();

  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return;
  }

  const currentNode = $getNodeByKey(nodeKey);
  if (!$isAlertNode(currentNode) || !currentNode.isAttached()) {
    return;
  }

  const firstChild = currentNode.getFirstChild();

  if (
    firstChild &&
    !$isElementNode(firstChild) &&
    !$isAlertTitleNode(firstChild)
  ) {
    const context = firstChild.getTextContent().replace(/\n/g, '');
    firstChild.replace($createAlertTitleNode(context));

    if (!$isAlertTitleNode(firstChild.getLatest())) {
      console.warn('Alert Plugin: AlertTitleNode not found, selection not retained. Please report this issue.');
      return;
    }

    firstChild.getLatest().selectStart();

    return;
  }

  const children = currentNode.getLatest().getChildren();

  children.forEach((child, index) => {

    child = child.getLatest();

    if ($isAlertTitleNode(child) && index >= 1) {
      child.replace($createAlertDescriptionNode(child.getTextContent()));
    }

    child = child.getLatest();

    const textContent = child.getTextContent();

    if ($isAlertDescriptionNode(child) && textContent.length >= 1) {
      // look for \u200B and remove it

      const textNode = child.getChildAtIndex(0);

      if ($isTextNode(textNode)) {
        const textContent = textNode.getTextContent().replace(/\u200B/g, '');
        textNode.setTextContent(textContent);
      } else {
        console.warn('Alert Plugin: TextNode not found, text not changed. Please report this issue.');
      }
    }

    if (child.getType() != 'text') {
      return;
    }

    const updatedChild = child.replace($createAlertDescriptionNode(child.getTextContent())).getLatest();
    // Do not lose selection
    updatedChild.selectStart();
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
    node.replace($createTextNode(node.getTextContent()));
  }
}
