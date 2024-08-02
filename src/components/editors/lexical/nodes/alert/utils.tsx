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
      $textNodeTransform(node, editor);
    })
  )
}

export function $alertNodeTransform(
  node: AlertNode,
  editor: LexicalEditor
) {
  const nodeKey = node.getKey();

  editor.update(
    () => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      const currentNode = $getNodeByKey(nodeKey);

      if (!$isAlertNode(currentNode) || !currentNode.isAttached()) {
        return false;
      }

      const alertContext = currentNode.getTextContent();
      const firstChild = currentNode.getChildAtIndex(0);
      console.log(currentNode.getChildren());

      if (
        !$isAlertDescriptionNode(firstChild) && 
        !$isAlertTitleNode(firstChild) &&
        $isTextNode(firstChild)
      ) {
        node.splice(0, node.getChildren().length, [
          $createAlertTitleNode(alertContext),
        ]);

        const alertTitleRef = currentNode.getLatest().getChildAtIndex(0);

        if (!$isAlertTitleNode(alertTitleRef)) {
          console.warn('Alert Plugin: AlertTitleNode not found, selection not retained. Please report this issue.');
          return false;
        }

        alertTitleRef.select(alertTitleRef.getTextContentSize(), alertTitleRef.getTextContentSize());

        return false;
      }

      currentNode.getChildren().forEach((child) => {
        if (
          !$isAlertDescriptionNode(child) && 
          !$isAlertTitleNode(child) &&
          $isTextNode(child) && 
          $isAlertDescriptionNode(child.getPreviousSibling())
        ) {
          child.replace($createAlertDescriptionNode(child.getTextContent()));
        } else if (
          !$isAlertDescriptionNode(child) && 
          !$isAlertTitleNode(child) &&
          $isTextNode(child) && 
          $isAlertTitleNode(child.getPreviousSibling())
        ) {
          child.replace($createAlertDescriptionNode(child.getTextContent()));
          const nextSibling = child.getNextSibling();

          if (!$isTextNode(nextSibling)) {
            return;
          }

          nextSibling.replace($createAlertDescriptionNode(nextSibling.getTextContent()));
        }
      });

      const alertTitleRef = currentNode.getLatest().getChildAtIndex(0);

      if (!$isAlertTitleNode(alertTitleRef)) {
        console.warn('Alert Plugin: AlertTitleNode not found, selection not retained. Please report this issue.');
        return false;
      }

      alertTitleRef.select(alertTitleRef.getTextContentSize(), alertTitleRef.getTextContentSize());
      console.log("selection After:", selection.anchor.offset, selection.focus.offset);

      return false;
    },
  );
}

function $textNodeTransform(
  node: TextNode,
  editor: LexicalEditor,
): void {
  // if node's parent is a alert node, we need to insert a AlertTitleNode

  const parent = node.getParent();
  if ($isAlertNode(parent)) {
    $alertNodeTransform(parent, editor);
  } else if ($isAlertTitleNode(parent) || $isAlertDescriptionNode(parent)) {
    node.replace($createTextNode(node.__text));
  }
}

function $updateAndRetainSelection(
  nodeKey: NodeKey,
  updateFn: () => boolean,
): void {
  const node = $getNodeByKey(nodeKey);
  if (!$isAlertNode(node) || !node.isAttached()) {
    return;
  }
  const selection = $getSelection();
  // If it's not range selection (or null selection) there's no need to change it,
  // but we can still run highlighting logic
  if (!$isRangeSelection(selection)) {
    updateFn();
    return;
  }

  const anchor = selection.anchor;
  const anchorOffset = anchor.offset;
  const isNewLineAnchor =
    anchor.type === 'element' &&
    $isLineBreakNode(node.getChildAtIndex(anchor.offset - 1));
  let textOffset = 0;

  // Calculating previous text offset (all text node prior to anchor + anchor own text offset)
  if (!isNewLineAnchor) {
    const anchorNode = anchor.getNode();
    textOffset =
      anchorOffset +
      anchorNode.getPreviousSiblings().reduce((offset, _node) => {
        return offset + _node.getTextContentSize();
      }, 0);
  }

  const hasChanges = updateFn();
  if (!hasChanges) {
    return;
  }

  // Non-text anchors only happen for line breaks, otherwise
  // selection will be within text node (code highlight node)
  if (isNewLineAnchor) {
    anchor.getNode().select(anchorOffset, anchorOffset);
    return;
  }

  // If it was non-element anchor then we walk through child nodes
  // and looking for a position of original text offset
  node.getChildren().some((_node) => {
    const isText = $isTextNode(_node);
    if (isText || $isLineBreakNode(_node)) {
      const textContentSize = _node.getTextContentSize();
      if (isText && textContentSize >= textOffset) {
        _node.select(textOffset, textOffset);
        return true;
      }
      textOffset -= textContentSize;
    }
    return false;
  });
}