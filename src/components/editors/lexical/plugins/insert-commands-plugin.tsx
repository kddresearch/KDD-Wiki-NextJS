import { $createCodeNode } from "@lexical/code";
import { $createLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import {
  $insertNodeToNearestRoot,
  mergeRegister
} from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalNode
} from "lexical";
import { useEffect, useMemo } from "react";

interface NodeTypeProps {
  create: (payload: string | undefined) => LexicalNode | null;
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

const nodeTypes: NodeType[] = ["H1", "H2", "H3", "H4", "H5", "H6", "CODE_BLOCK", "CODE_BLOCK_TS", "CODE_BLOCK_PY", "CODE_BLOCK_MD", "CODE_BLOCK_BASH", "LINK"];

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
      CODE_BLOCK_PY: { create: (payload) => $createCodeNode("python") },
      CODE_BLOCK_MD: { create: (payload) => $createCodeNode("markdown") },
      CODE_BLOCK_BASH: { create: (payload) => $createCodeNode("bash") },
      LINK: { create: (payload) => {

        if (!payload) return null;

        editor.dispatchCommand(TOGGLE_LINK_COMMAND, payload);

        return null;
      }},
    };
  }, [editor]);

  useEffect(() => {
    console.log("InsertCommandsPlugin");

    const registeredCommands = (Object.keys(COMMANDS) as InsertCommandType[]).map((command_key) => {
      const command = COMMANDS[command_key];

      console.log("Registering command", command_key);

      return editor.registerCommand(command, (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        console.log("payload:", payload);

        const nodeTypeKey = command_key.replace('INSERT_', '') as NodeType;

        const focusNode = selection.focus.getNode();
        if (focusNode !== null) {
          const newNode = NODE_TYPES[nodeTypeKey].create(payload);

          if (newNode === null) {
            return true;
          }

          const node = focusNode.getLatest();

          console.log("offset:", selection.focus.offset, "content size:", node.getTextContentSize());

          if (selection.focus.offset === node.getTextContentSize()) {
            node.getParent()?.insertAfter(newNode, true);
            return true;
          }
          
          $insertNodeToNearestRoot(newNode);
        }

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