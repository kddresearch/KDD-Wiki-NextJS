"use client";

import { $createCodeNode } from "@lexical/code";
import {
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  $getNearestBlockElementAncestorOrThrow,
  $insertNodeToNearestRoot,
  mergeRegister
} from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  ElementNode,
  LexicalCommand,
  LexicalNode
} from "lexical";
import { useEffect, useMemo } from "react";
import { $createAlertNode, $createAlertTitleNode } from "../nodes/alert";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { QUOTE } from "@lexical/markdown";

interface NodeTypeProps {
  create: (payload: string | undefined) => ElementNode | true;
}

type NodeType =
  "ALERT_DEFAULT"
  | "ALERT_DESTRUCTIVE"
  | "ALERT_PRIMARY"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "H6"
  | "QUOTE"
  | "CODE_BLOCK"
  | "CODE_BLOCK_TS"
  | "CODE_BLOCK_PY"
  | "CODE_BLOCK_MD"
  | "CODE_BLOCK_BASH"
  | "LIST"
  | "LINK"
  | "USER_MENTION"
  | "PLANNER_MENTION"
  | "TAG_MENTION"
;

type NodeTypes = {
  [key in NodeType]: NodeTypeProps
};

type InsertCommandType = `INSERT_${NodeType}`;

type CommandNames = {
  [K in NodeType as `INSERT_${K}`]: LexicalCommand<string | undefined>
};

export const COMMANDS: CommandNames = {} as CommandNames;

(Object.keys(COMMANDS) as Array<keyof CommandNames>).forEach((key) => {
  COMMANDS[key] = createCommand();
});

const nodeTypes: NodeType[] = [
  "ALERT_DEFAULT",
  "ALERT_PRIMARY",
  "ALERT_DESTRUCTIVE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "QUOTE",
  "CODE_BLOCK",
  "CODE_BLOCK_TS",
  "CODE_BLOCK_PY",
  "CODE_BLOCK_MD",
  "CODE_BLOCK_BASH",
  "LIST",
  "LINK",
  "USER_MENTION",
  "PLANNER_MENTION",
  "TAG_MENTION",
];

nodeTypes.forEach((nodeType) => {
  const commandKey = `INSERT_${nodeType}` as InsertCommandType;
  COMMANDS[commandKey] = createCommand<string | undefined>(commandKey);
});

function InsertCommandsPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const NODE_TYPES: NodeTypes = useMemo(() => {
    return {
      ALERT_DEFAULT: { create: (payload) => $createAlertNode("default").append($createAlertTitleNode()) },
      ALERT_PRIMARY: { create: (payload) => $createAlertNode("primary").append($createAlertTitleNode()) },
      ALERT_DESTRUCTIVE: { create: (payload) => $createAlertNode("destructive").append($createAlertTitleNode()) },
      H1: { create: (payload) => $createHeadingNode("h1") },
      H2: { create: (payload) => $createHeadingNode("h2") },
      H3: { create: (payload) => $createHeadingNode("h3") },
      H4: { create: (payload) => $createHeadingNode("h4") },
      H5: { create: (payload) => $createHeadingNode("h5") },
      H6: { create: (payload) => $createHeadingNode("h6") },
      QUOTE: { create: (payload) => $createQuoteNode() },
      CODE_BLOCK: { create: (payload) => $createCodeNode("plaintext") },
      CODE_BLOCK_TS: { create: (payload) => $createCodeNode("typescript") },
      CODE_BLOCK_PY: { create: (payload) => $createCodeNode("py") },
      CODE_BLOCK_MD: { create: (payload) => $createCodeNode("markdown") },
      CODE_BLOCK_BASH: { create: (payload) => $createCodeNode("bash") },
      LIST: { create: (payload) => $createListNode('bullet').append($createListItemNode()) },
      LINK: { create: (payload) => {

        let title = payload;
        if (!payload) {
          console.log("No payload provided, using current URL");
          payload = window.location.protocol + "//" + window.location.host;
          console.log("payload", payload);
        }

        const lexicalSelection = $getSelection();
        if ($isRangeSelection(lexicalSelection) && lexicalSelection.isCollapsed()) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, payload);
          return true;
        }

        return $createLinkNode(payload).append($createTextNode(title));
      }},
      USER_MENTION: { create: (payload) => $createParagraphNode().append($createTextNode("@")) },
      PLANNER_MENTION: { create: (payload) => $createParagraphNode().append($createTextNode("@planner-integration(id='12345')")) },
      TAG_MENTION: { create: (payload) => $createParagraphNode().append($createTextNode("#")) },
    };
  }, [editor]);

  useEffect(() => {
    const registeredCommands = (Object.keys(COMMANDS) as InsertCommandType[]).map((command_key) => {
      const command = COMMANDS[command_key];

      return editor.registerCommand(command, (payload) => {
        const lexicalSelection = $getSelection();
        if (!$isRangeSelection(lexicalSelection)) {
          return false;
        }

        const anchor = lexicalSelection.anchor;
        const focus = lexicalSelection.focus;
        const focusFirst = focus.isBefore(anchor);
        const first = focusFirst ? focus : anchor;
        const last = focusFirst ? anchor : focus;
        const firstNode = first.getNode();

        const isCollapsed = lexicalSelection.isCollapsed();
        const lastEndsNode = last.getNode().getTextContentSize() === last.offset;

        const nodeTypeKey = command_key.replace('INSERT_', '') as NodeType;
        let newNode = NODE_TYPES[nodeTypeKey].create(payload);

        if (newNode === true) {
          return newNode;
        }


        if (lastEndsNode && isCollapsed) {
          newNode = $isLinkNode(newNode) ? $createParagraphNode().append(newNode) : newNode;
          $getNearestBlockElementAncestorOrThrow(firstNode).insertAfter(newNode, true);
          newNode.getLatest().selectEnd();
          return true;
        }

        console.log('newNode', newNode);

        if (!isCollapsed) {
          if ($isLinkNode(newNode)) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, newNode.getURL());
            return true;
          }

          const latestNode = newNode.getLatest();
          const textContent = lexicalSelection.getTextContent();

          const textNode = $createTextNode(textContent);
          latestNode.append(textNode);
          

          console.log('firstNode', firstNode);

          lastEndsNode ? $getValidElementAncestor(firstNode).insertAfter(newNode, true) : $insertNodeToNearestRoot(newNode);
          lexicalSelection.removeText();

          const latestTextNode = textNode.getLatest();
          const [start, end] = focusFirst ? [latestTextNode.getTextContentSize(), 0] : [0, latestTextNode.getTextContentSize()];

          latestTextNode.select(start, end);
          return true;
        }

        $insertNodeToNearestRoot(newNode);
        const latestNode = newNode.getLatest();
        latestNode.selectStart();

        return true;
      }, COMMAND_PRIORITY_EDITOR);
    })

    return mergeRegister(...registeredCommands);
  }, [editor, NODE_TYPES]);

  return (
    <>
    </>
  );
}

function $getValidElementAncestor(node: LexicalNode): ElementNode {
  if ($isElementNode(node) && !$isLinkNode(node)) {
    return node;
  }

  console.log('node', node);
  const parent = node.getParent();
  if (!parent) {
    throw new Error('Expected a parent node');
  }

  return $getValidElementAncestor(parent);
}

export default InsertCommandsPlugin;