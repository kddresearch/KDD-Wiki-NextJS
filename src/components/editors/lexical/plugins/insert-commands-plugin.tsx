import { $createCodeNode } from "@lexical/code";
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
  create: () => LexicalNode;
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
;

type NodeTypes = {
  [key in NodeType]: NodeTypeProps
};

type InsertCommandType = `INSERT_${NodeType}`;

type CommandNames = {
  [K in NodeType as `INSERT_${K}`]: LexicalCommand<void>
};

export const COMMANDS: CommandNames = {} as CommandNames;

(Object.keys(COMMANDS) as Array<keyof CommandNames>).forEach((key) => {
  COMMANDS[key] = createCommand();
});

const nodeTypes: NodeType[] = ["H1", "H2", "H3", "H4", "H5", "H6", "CODE_BLOCK", "CODE_BLOCK_TS", "CODE_BLOCK_PY", "CODE_BLOCK_MD"];

nodeTypes.forEach((nodeType) => {
  const commandKey = `INSERT_${nodeType}` as InsertCommandType;
  COMMANDS[commandKey] = createCommand();
});

function InsertCommandsPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const NODE_TYPES: NodeTypes = useMemo(() => {
    return {
      H1: { create: () => $createHeadingNode("h1") },
      H2: { create: () => $createHeadingNode("h2") },
      H3: { create: () => $createHeadingNode("h3") },
      H4: { create: () => $createHeadingNode("h4") },
      H5: { create: () => $createHeadingNode("h5") },
      H6: { create: () => $createHeadingNode("h6") },
      CODE_BLOCK: { create: () => $createCodeNode("plaintext") },
      CODE_BLOCK_TS: { create: () => $createCodeNode("typescript") },
      CODE_BLOCK_PY: { create: () => $createCodeNode("python") },
      CODE_BLOCK_MD: { create: () => $createCodeNode("markdown") },
    };
  }, []);

  useEffect(() => {
    console.log("InsertCommandsPlugin");

    const registeredCommands = (Object.keys(COMMANDS) as InsertCommandType[]).map((command_key) => {
      const command = COMMANDS[command_key];

      console.log("Registering command", command_key);

      return editor.registerCommand(command, () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const nodeTypeKey = command_key.replace('INSERT_', '') as NodeType;

        const focusNode = selection.focus.getNode();
        if (focusNode !== null) {
          const newNode = NODE_TYPES[nodeTypeKey].create();

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