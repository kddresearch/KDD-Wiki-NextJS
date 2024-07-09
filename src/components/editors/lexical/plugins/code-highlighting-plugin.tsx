/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {CodeHighlightNode, PrismTokenizer, registerCodeHighlighting} from '@lexical/code';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import Prism from 'prismjs';

export default function CodeHighlightPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  // useEffect(() => {
  //   return editor.registerNodeTransform(CodeHighlightNode, (node) => {
  //     const codeText = node.getTextContent();
  //     const language = node.getHighlightType();

  //     if (language && Prism.languages[language]) {
  //       const highlightedCode = Prism.highlight(codeText, Prism.languages[language], language);
  //       node.setTextContent(highlightedCode);
  //     }
  //   })
  // })

  return null;
}
