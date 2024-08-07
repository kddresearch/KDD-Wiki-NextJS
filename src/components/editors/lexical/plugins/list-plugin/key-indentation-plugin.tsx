/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalCommand, LexicalEditor, RangeSelection} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$filter, $getNearestBlockElementAncestorOrThrow} from '@lexical/utils';
import {
  $createRangeSelection,
  $getSelection,
  $isBlockElementNode,
  $isRangeSelection,
  $normalizeSelection__EXPERIMENTAL,
  COMMAND_PRIORITY_EDITOR,
  INDENT_CONTENT_COMMAND,
  INSERT_TAB_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import {useEffect} from 'react';
import { $isListItemNode } from '@lexical/list';
import {
  KEY_LEFT_BRACKET_COMMAND,
  KEY_RIGHT_BRACKET_COMMAND
} from '../keyboard-commands-plugin';

function $canIndent(selection: RangeSelection): boolean {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const first = focus.isBefore(anchor) ? focus : anchor;
  const firstNode = first.getNode();
  const firstBlock = $getNearestBlockElementAncestorOrThrow(firstNode);

  if (!$isListItemNode(firstBlock)) {
    return false;
  }

  if (firstBlock.canIndent()) {

    const firstSibling = firstBlock.getPreviousSibling();
    const currentIndent = firstBlock.getIndent();

    if (!firstSibling || !$isListItemNode(firstSibling)) {
      return false;
    }

    const firstSiblingElement = $getNearestBlockElementAncestorOrThrow(firstSibling);
    const previousIndent = firstSiblingElement.getIndent();

    if (previousIndent + 1 < currentIndent) {
      return false;
    }

    return true;
  }

  return false;
}

export function registerTabIndentation(editor: LexicalEditor) {

  editor.registerCommand<KeyboardEvent>(
    KEY_LEFT_BRACKET_COMMAND,
    (event) => {

      if (!event.ctrlKey) {
        return false;
      }

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      event.preventDefault();
      const command: LexicalCommand<void> | null = OUTDENT_CONTENT_COMMAND
      return editor.dispatchCommand(command, undefined);
    }, 
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<KeyboardEvent>(
    KEY_RIGHT_BRACKET_COMMAND,
    (event) => {

      if (!event.ctrlKey) {
        return false;
      }

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      event.preventDefault();
      const command: LexicalCommand<void> | null = $canIndent(selection) 
        ? INDENT_CONTENT_COMMAND
        : null;

      if (!command) {
        return false;
      }

      return editor.dispatchCommand(command, undefined);
    }, 
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand<KeyboardEvent>(
    KEY_TAB_COMMAND,
    (event) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      event.preventDefault();
      const command: LexicalCommand<void> | null = event.shiftKey
        ? OUTDENT_CONTENT_COMMAND
        : $canIndent(selection)
          ? INDENT_CONTENT_COMMAND
          : null;

      if (!command) {
        return false;
      }

      return editor.dispatchCommand(command, undefined);
    },
    COMMAND_PRIORITY_EDITOR,
  );

  return;
}

/**
 * This plugin adds the ability to indent content using the tab key. Generally, we don't
 * recommend using this plugin as it could negatively affect acessibility for keyboard
 * users, causing focus to become trapped within the editor.
 */
export function KeyIndentationPlugin(): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerTabIndentation(editor);
  });

  return null;
}
