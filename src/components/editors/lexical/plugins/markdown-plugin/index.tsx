import {
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { KDD_TRANSFORMERS } from './transform';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';

export default function MarkdownPlugin(): JSX.Element | null {
  return (
    <MarkdownShortcutPlugin transformers={KDD_TRANSFORMERS} />
  );
}
