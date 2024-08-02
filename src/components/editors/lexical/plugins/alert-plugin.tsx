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
import { registerAlertNodeTransforms } from '../nodes/alert/utils';

export default function AlertPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerAlertNodeTransforms(editor);
  }, [editor]);

  return null;
}

