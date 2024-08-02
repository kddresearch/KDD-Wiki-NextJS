import type { Klass, LexicalNode } from 'lexical';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AlertNode } from './alert';
import { AlertTitleNode } from './alert/title';
import { AlertDescriptionNode } from './alert/description';

const editorNodes: Array<Klass<LexicalNode>> = [
  CodeHighlightNode,
  CodeNode,
  HashtagNode,
  AutoLinkNode,
  LinkNode,
  ListNode,
  ListItemNode,
  MarkNode,
  OverflowNode,
  HorizontalRuleNode,
  HeadingNode,
  QuoteNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  AlertNode,
  AlertTitleNode,
  AlertDescriptionNode
];

export default editorNodes;

import {
  Code,
  Hash,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Link,
  List,
  Quote,
  UserSearch,
  Table2
} from "lucide-react"

enum Category {
  SUGGESTIONS = "Suggestions",
  FORMATTING = "Formatting",
  INTEGRATIONS = "Integrations",
}

import { COMMANDS } from '../plugins/insert-commands-plugin';

const nodeKeyboardShortcuts = [
  {
    category: Category.SUGGESTIONS,
    shortcuts: [
      {
        icon: <Heading1Icon />,
        name: "Heading 1",
        shortcut: "(Largest) #",
        command: COMMANDS.INSERT_H1
      },
      {
        icon: <Heading2Icon />,
        name: "Heading 2",
        shortcut: "##",
        node: HeadingNode,
        command: COMMANDS.INSERT_H2
      },
      {
        icon: <Heading3Icon />,
        name: "Heading 3",
        shortcut: "(Smallest) ###",
        node: HeadingNode,
      },
    ]
  },
  {
    category: Category.FORMATTING,
    shortcuts: [
      {
        icon: <Link />,
        name: "Link",
        shortcut: "[Title](https://url.com)",
      },
      {
        icon: <List />,
        name: "List",
        shortcut: "- Item",
      },
      {
        icon: <Quote />,
        name: "Quote",
        shortcut: "> Quote",
      },
      {
        icon: <Code />,
        name: "Code",
        shortcut: "```Language",
      }
    ]
  },
  {
    category: Category.INTEGRATIONS,
    shortcuts: [
      {
        icon: <UserSearch />,
        name: "Mention User",
        shortcut: "@Username",
      },
      {
        icon: <Hash />,
        name: "Mention Tag",
        shortcut: "#Tag or #TagID",
      },
      {
        icon: <Table2 />,
        name: "Planner Card",
        shortcut: "@planner-integration(id='12345')",
      },
      {
        icon: <Code />,
        name: "Code",
        shortcut: "```Language",
      },
    ]
  }
]

export { nodeKeyboardShortcuts };