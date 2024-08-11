import { $createCodeNode } from "@lexical/code";
import {
  $createLinkNode,
  TOGGLE_LINK_COMMAND
} from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import {
  $getNearestBlockElementAncestorOrThrow,
  $insertNodeToNearestRoot,
  mergeRegister
} from "@lexical/utils";
import {
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
import { $createAlertNode } from "../nodes/alert";

interface NodeTypeProps {
  create: (payload: string | undefined) => ElementNode;
}

type NodeType =
  "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "H6"
  | "CODE_BLOCK"
  | "CODE_BLOCK_TS"
  | "CODE_BLOCK_PY"
  | "CODE_BLOCK_MD"
  | "CODE_BLOCK_BASH"
  | "ALERT_DEFAULT"
  | "ALERT_PRIMARY"
  | "ALERT_DESTRUCTIVE"
  | "LINK";
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

const nodeTypes: NodeType[] = ["H1", "H2", "H3", "H4", "H5", "H6", "CODE_BLOCK", "CODE_BLOCK_TS", "CODE_BLOCK_PY", "CODE_BLOCK_MD", "CODE_BLOCK_BASH", "ALERT_DEFAULT", "ALERT_PRIMARY", "ALERT_DESTRUCTIVE", "LINK"];

nodeTypes.forEach((nodeType) => {
  const commandKey = `INSERT_${nodeType}` as InsertCommandType;
  COMMANDS[commandKey] = createCommand<string | undefined>("string");
});

function InsertCommandsPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const NODE_TYPES: NodeTypes = useMemo(() => {
    return {
      H1: { create: (payload) => $createHeadingNode("h1") },
      H2: { create: (payload) => $createHeadingNode("h2") },
      H3: { create: (payload) => $createHeadingNode("h3") },
      H4: { create: (payload) => $createHeadingNode("h4") },
      H5: { create: (payload) => $createHeadingNode("h5") },
      H6: { create: (payload) => $createHeadingNode("h6") },
      CODE_BLOCK: { create: (payload) => $createCodeNode("plaintext") },
      CODE_BLOCK_TS: { create: (payload) => $createCodeNode("typescript") },
      CODE_BLOCK_PY: { create: (payload) => $createCodeNode("py") },
      CODE_BLOCK_MD: { create: (payload) => $createCodeNode("markdown") },
      CODE_BLOCK_BASH: { create: (payload) => $createCodeNode("bash") },
      ALERT_DEFAULT: { create: (payload) => $createAlertNode("default") },
      ALERT_PRIMARY: { create: (payload) => $createAlertNode("primary") },
      ALERT_DESTRUCTIVE: { create: (payload) => $createAlertNode("destructive") },
      LINK: { create: (payload) => {
        if (!payload) throw new Error("You must provide a payload (url) to create a link node");

        return $createLinkNode(payload);
      }},
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
        const firstParent = firstNode.getParent();
        const firstParentIsRoot = $isRootNode(firstParent);

        const isCollapsed = lexicalSelection.isCollapsed();
        const lastEndsNode = last.getNode().getTextContentSize() === last.offset;

        const nodeTypeKey = command_key.replace('INSERT_', '') as NodeType;
        const newNode = NODE_TYPES[nodeTypeKey].create(payload);

        console.log('newNode', newNode);

        if (lastEndsNode && isCollapsed) {

          $getNearestBlockElementAncestorOrThrow(firstNode).insertAfter(newNode, true);
          newNode.getLatest().selectStart();
          return true;
        }

        if (!isCollapsed) {
          const latestNode = newNode.getLatest();
          const textContent = lexicalSelection.getTextContent();
          lexicalSelection.removeText();

          console.log("textContent:", textContent);

          const textNode = $createTextNode(textContent);
          latestNode.append(textNode);

          lastEndsNode ? $getNearestBlockElementAncestorOrThrow(firstNode).insertAfter(newNode, true) : $insertNodeToNearestRoot(newNode);

          console.log('lastEndsNode', lastEndsNode);

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

export default InsertCommandsPlugin;