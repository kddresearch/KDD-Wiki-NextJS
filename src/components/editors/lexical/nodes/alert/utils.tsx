import { ElementTransformer } from "@lexical/markdown";
import { ElementNode } from "lexical";
import { AlertVariant } from "./root";

export const createBlockNode = (
  createNode: (match: Array<string>) => ElementNode,
): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const node = createNode(match);
    node.append(...children);
    parentNode.replace(node);
    node.select(0, 0);
  };
};

export function isAlertVariant(value: any): value is AlertVariant {
  return ['default', 'primary', 'destructive'].includes(value);
}
