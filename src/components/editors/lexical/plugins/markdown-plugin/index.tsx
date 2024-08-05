import {
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { KDD_TRANSFORMERS } from './transform';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';

interface MarkdownEditorProps {
  onMardownContentChange?: (newMarkdownContent: string) => void;
  useMarkdownShortcuts?: boolean;
}

export default function MarkdownPlugin({
  onMardownContentChange,
  useMarkdownShortcuts
}:
  MarkdownEditorProps
): JSX.Element {

  const [editor] = useLexicalComposerContext();

  if (onMardownContentChange && !editor.isComposing()) {
    editor.registerTextContentListener(() => {
      editor.update(() => {
        const markdown = $convertToMarkdownString(KDD_TRANSFORMERS);
        onMardownContentChange(markdown);
      })
    })
  }

  return (
    useMarkdownShortcuts ? 
    <MarkdownShortcutPlugin transformers={KDD_TRANSFORMERS} /> : <></>
  );
}
