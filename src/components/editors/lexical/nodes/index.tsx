import type { Klass, LexicalCommand, LexicalNode } from 'lexical';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { AlertNode, AlertTitleNode, AlertDescriptionNode } from './alert';
import { MakrdownEditorCodeNode } from './markdown';

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
  AlertDescriptionNode,
  MakrdownEditorCodeNode
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
  Table2,
  Info,
  CircleAlert,
  OctagonAlert
} from "lucide-react"

enum Category {
  BASIC = "Basic",
  FORMATTING = "Formatting",
  INTEGRATIONS = "Integrations",
}

import { COMMANDS } from '../plugins/insert-commands-plugin';
import { common } from '@mui/material/colors';

type Shortcut = {
  icon: JSX.Element;
  name: string;
  shortcut: string;
  keywords?: string[];
  node: Klass<LexicalNode>;
  command?: LexicalCommand<string | undefined>;
}

type ShortcutCategory = {
  category: Category;
  shortcuts: Shortcut[];
}

const nodeKeyboardShortcuts = [
  {
    category: Category.BASIC,
    shortcuts: [
      {
        icon: <Heading1Icon />,
        name: "Heading 1",
        shortcut: "(Largest) #",
        keywords: [Category.BASIC, "heading", "h1", "#"],
        node: HeadingNode,
        command: COMMANDS.INSERT_H1
      },
      {
        icon: <Heading2Icon />,
        name: "Heading 2",
        shortcut: "##",
        keywords: [Category.BASIC, "heading", "h2", "##"],
        node: HeadingNode,
        command: COMMANDS.INSERT_H2
      },
      {
        icon: <Heading3Icon />,
        name: "Heading 3",
        shortcut: "(Smallest) ###",
        keywords: [Category.BASIC, "heading", "h3", "###"],
        node: HeadingNode,
        command: COMMANDS.INSERT_H3
      },
      {
        icon: <Info />,
        name: "Alert",
        shortcut: "> [!TITLE:default]",
        node: AlertNode,
        command: COMMANDS.INSERT_ALERT_DEFAULT
      },
      {
        icon: <CircleAlert className='text-purple' />,
        name: "Alert Primary",
        shortcut: "> [!TITLE:primary]",
        node: AlertNode,
        command: COMMANDS.INSERT_ALERT_PRIMARY
      },
      {
        icon: <OctagonAlert className='text-destructive' />,
        name: "Alert Destructive",
        shortcut: "> [!TITLE:destructive]",
        node: AlertNode,
        command: COMMANDS.INSERT_ALERT_DESTRUCTIVE
      }
    ]
  },
  {
    category: Category.FORMATTING,
    shortcuts: [
      {
        icon: <Link />,
        name: "Link",
        shortcut: "[Title](https://url.com)",
        node: LinkNode,
        command: COMMANDS.INSERT_LINK
      },
      {
        icon: <List />,
        name: "List",
        shortcut: "- Item",
        node: ListNode,
        command: COMMANDS.INSERT_LIST
      },
      {
        icon: <Quote />,
        name: "Quote",
        shortcut: "> Quote",
        node: QuoteNode,
        command: COMMANDS.INSERT_QUOTE
      },
      {
        icon: <Code />,
        name: "Code",
        shortcut: "```Language",
        node: CodeNode,
        command: COMMANDS.INSERT_CODE_BLOCK
      }
    ] as Shortcut[]
  },
  {
    category: Category.INTEGRATIONS,
    shortcuts: [
      {
        icon: <UserSearch />,
        name: "Mention User",
        shortcut: "@Username",
        command: COMMANDS.INSERT_USER_MENTION
      },
      {
        icon: <Hash />,
        name: "Mention Tag",
        shortcut: "#Tag or #TagID",
        command: COMMANDS.INSERT_TAG_MENTION
      },
      {
        icon: <Table2 />,
        name: "Planner Card",
        shortcut: "@planner-integration(id='12345')",
        command: COMMANDS.INSERT_PLANNER_MENTION
      },
    ] as Shortcut[]
  }
] as ShortcutCategory[];

export { nodeKeyboardShortcuts };