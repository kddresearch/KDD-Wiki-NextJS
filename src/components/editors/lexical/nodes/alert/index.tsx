import { DecoratorNode, EditorConfig, ElementNode, LexicalNode, NodeKey, SerializedElementNode, SerializedLexicalNode, TextNode } from "lexical";
import { ReactNode } from "react";
import type {Spread} from 'lexical';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Terminal } from "lucide-react";

// export class AlertNode extends ElementNode {
//   // __title: string;
//   // __description: string;
//   // __type: string;
  
//   // constructor(title: string, key?: NodeKey) {
//   //   super(title, key);
//   //   this.__title = title;
//   //   this.__description = '';
//   //   this.__type = 'info';
//   // }
  
//   // static getType(): string {
//   //   return 'alert-node';
//   // }
  
//   // static clone(node: AlertNode): AlertNode {
//   //   return new AlertNode(node.__title, node.__key);
//   // }

//   // createDOM(config: EditorConfig): HTMLElement {
//   //   const element = super.createDOM(config);

//   //   console.log(element);
//   //   return element;
//   // }
  
//   // setTitle(title: string) {
//   //   const self = this.getWritable();
//   //   self.__title = title;
//   // }

//   // getTitle(): string {
//   //   const self = this.getLatest();
//   //   return self.__title;
//   // }

//   static getType(): string {
//     return 'alert';
//   }

//   static clone(node: AlertNode): AlertNode {
//     return new AlertNode(node.__key);
//   }

//   createDOM(): HTMLElement {
//     // Define the DOM element here
//     const dom = document.createElement('p');
//     return dom;
//   }

//   updateDOM(prevNode: AlertNode, dom: HTMLElement): boolean {
//     // Returning false tells Lexical that this node does not need its
//     // DOM element replacing with a new copy from createDOM.
//     return false;
//   }
// }

export type variant = "default" | "destructive" | null | undefined;

export type SerializedAlertNode = Spread<
  {
    title: string;
    description: string;
    variant: variant;
  },
  SerializedElementNode
>;

export class AlertNode extends DecoratorNode<ReactNode> {
  __title: string;
  __description: string;
  __variant: variant;

  static getType(): string {
    return 'alert';
  }

  static clone(node: AlertNode): AlertNode {
    return new AlertNode(node.__title, node.__description, node.__variant, node.__key);
  }

  constructor(title: string, description: string, variant?: variant, key?: NodeKey) {
    super(key);
    this.__title = title;
    this.__description =  description;
    this.__variant = variant ?? 'destructive';
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): false {
    return false;
  }

  exportJSON(): SerializedAlertNode {
    return {
      ...super.exportJSON(),
      type: AlertNode.getType(),
      title: this.__title,
      description: this.__description,
      variant: this.__variant,
      version: 1,
      children: [], // Add this
      direction: null, // Add this
      format: '', // Add this
      indent: 0, // Add this
    };
  }

  decorate(): ReactNode {
    return (
      <Alert variant={this.__variant}>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>{this.__title}</AlertTitle>
        <AlertDescription>
          {this.__description}
        </AlertDescription>
      </Alert>
    );
  }
}

export function $createAlertNode(title: string, description: string, variant?: variant): AlertNode {
  return new AlertNode(title, description, variant);
}

export function $isAlertNode(
  node: LexicalNode | null | undefined,
): node is AlertNode {
  return node instanceof AlertNode;
}

// export function $createAlertNode(title: string): AlertNode {
//   return new AlertNode();
// }

// export function $isAlertNode(node: LexicalNode | null | undefined): node is AlertNode {
//   return node instanceof AlertNode;
// }
