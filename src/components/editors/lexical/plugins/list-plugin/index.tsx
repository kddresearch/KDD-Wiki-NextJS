import { ListPlugin as LexicalListPlugin } from '@lexical/react/LexicalListPlugin';
import { KeyIndentationPlugin } from './key-indentation-plugin';
import ListMaxIndentLevelPlugin from './max-indent-plugin';
import { PreventOrphanedIndentsPlugin } from './prevent-orphaned-indents-plugin';

export function ListPlugin() {
  return (
    <>
      <LexicalListPlugin />
      <KeyIndentationPlugin />
      <ListMaxIndentLevelPlugin maxDepth={7} />
      <PreventOrphanedIndentsPlugin />
    </>
  );
}