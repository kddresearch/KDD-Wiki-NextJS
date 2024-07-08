import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  ElementTransformer,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TextMatchTransformer,
  Transformer,
  TRANSFORMERS
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table';
import {
  $createTextNode,
  $isParagraphNode,
  $isTextNode,
  LexicalNode,
} from 'lexical';
  
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

export default function MarkdownPlugin(): JSX.Element | null {

  const [editor] = useLexicalComposerContext();

  const handleConvertToMarkdown = () => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      console.log(markdown);
    });
  };

  return (
    <div>
      <button onClick={handleConvertToMarkdown}>Convert to Markdown</button>
    </div>
  );
}

