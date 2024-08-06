import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { KDD_TRANSFORMERS } from './transform';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TOGGLE_DIRECT_MARKDOWN_COMMAND } from './direct-editor';
import { useEffect, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import { $createTextNode, $getRoot, $isRootNode, RootNode } from 'lexical';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createMakrdownEditorCodeNode, $isMakrdownEditorCodeNode, MakrdownEditorCodeNode } from '../../nodes/markdown';

const LowPriority = 1;

interface MarkdownEditorProps {
  onMardownContentChange?: (newMarkdownContent: string) => void;
  useMarkdownShortcuts?: boolean;
}

export {
  TOGGLE_DIRECT_MARKDOWN_COMMAND
}

export default function MarkdownPlugin({
  onMardownContentChange,
  useMarkdownShortcuts
}:
  MarkdownEditorProps
): JSX.Element {

  const [editor] = useLexicalComposerContext();
  const [isMarkdownEditor, setIsMarkdownEditor] = useState(false);

  if (onMardownContentChange && !editor.isComposing()) {
    editor.registerTextContentListener(() => {
      editor.update(() => {
        const markdown = $convertToMarkdownString(KDD_TRANSFORMERS);
        onMardownContentChange(markdown);
      })
    })
  }

  useEffect(() => {

    editor.registerNodeTransform(MakrdownEditorCodeNode, (node) => {

      if (!node.isAttached()) {
        return;
      }

      const root = $getRoot();
      const childrenSize = root.getChildrenSize();

      if (childrenSize <= 1 && $isRootNode(node.getParent())) {
        return;
      }

      if (childrenSize > 1) {
        const children = root.getChildren();

        const result = children.every((child) => {
          if ($isMakrdownEditorCodeNode(child)) {
            return true;
          }

          console.log('appending new child', child.getTextContent());

          node.append($createTextNode(child.getTextContent()));
          child.remove();

          if (child.isAttached()) {
            console.warn('could not remove child from root node');
            return false;
          }
          return true;
        })

        if (result) {
          return;
        } else {
          throw new Error('Markdown editor has more than one child, could not replace all children with MarkdownEditorCodeNode');
        }
      }
    })

    return mergeRegister(
      editor.registerCommand(
        TOGGLE_DIRECT_MARKDOWN_COMMAND,
        (payload) => {
          editor.update(() => {
            const root = $getRoot();
            const firstChild = root.getFirstChild();
            const isMarkdownEditor = $isMakrdownEditorCodeNode(firstChild);

            if (isMarkdownEditor) {
              setIsMarkdownEditor(false);

              $convertFromMarkdownString(
                firstChild.getTextContent(),
                KDD_TRANSFORMERS,
                undefined,
                false
              );
            } else {
              setIsMarkdownEditor(true);

              const markdown = $convertToMarkdownString(
                KDD_TRANSFORMERS,
                undefined,
                false
              );

              root
                .clear()
                .append(
                  $createMakrdownEditorCodeNode(markdown)
                );
            }
          });
          return false;
        },
        LowPriority
      )
    )
  });

  return (
    useMarkdownShortcuts ? 
    <MarkdownShortcutPlugin transformers={KDD_TRANSFORMERS} /> : <></>
  );
}
