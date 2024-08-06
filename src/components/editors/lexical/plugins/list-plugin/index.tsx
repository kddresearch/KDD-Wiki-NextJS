import { ListPlugin as LexicalListPlugin } from '@lexical/react/LexicalListPlugin';
import { KeyIndentationPlugin } from './key-indentation-plugin';
import ListMaxIndentLevelPlugin from './max-indent-plugin';
import { PreventOrphanedIndentsPlugin } from './prevent-orphaned-indents-plugin';

export function ListPlugin() {
  const maxDepth = 7;

  return (
    <>
      <LexicalListPlugin />
      <KeyIndentationPlugin />
      <ListMaxIndentLevelPlugin maxDepth={maxDepth} />
      <PreventOrphanedIndentsPlugin maxDepth={maxDepth}/>
    </>
  );
}