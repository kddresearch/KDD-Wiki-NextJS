import { ListPlugin as LexicalListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from './tab-indentation-plugin';
import ListMaxIndentLevelPlugin from './max-indent-plugin';

export function ListPlugin() {
  return (
    <>
      <LexicalListPlugin />
      <TabIndentationPlugin />
      <ListMaxIndentLevelPlugin maxDepth={7} />
    </>
  );
}