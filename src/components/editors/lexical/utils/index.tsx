/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// FROM https://github.com/facebook/lexical/blob/main/packages/shared/src/canUseDOM.ts
// PERMALINK: https://github.com/facebook/lexical/blob/6558e2299896a8804e6c064b4c40946208649732/packages/shared/src/canUseDOM.ts#L9
export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

// FROM https://github.com/facebook/lexical/blob/main/packages/shared/src/environment.ts
// PERMALINK: https://github.com/facebook/lexical/blob/bbeba944782ef782046b778f0df290845cb0d6be/packages/shared/src/environment.ts#L27
const IS_FIREFOX: boolean =
  CAN_USE_DOM && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);

// FROM https://github.com/facebook/lexical/blob/main/packages/lexical-utils/src/index.ts
// PERMALINK: https://github.com/facebook/lexical/blob/bbeba944782ef782046b778f0df290845cb0d6be/packages/lexical-utils/src/index.ts#L595

/**
 * Calculates the zoom level of an element as a result of using
 * css zoom property.
 * @param element
 */
export function calculateZoomLevel(element: Element | null): number {
  if (IS_FIREFOX) {
    return 1;
  }
  let zoom = 1;
  while (element) {
    zoom *= Number(window.getComputedStyle(element).getPropertyValue('zoom'));
    element = element.parentElement;
  }
  return zoom;
}

export function sanitizeURL(url: string): string {

  try {
    // Only allow supported protocols
    const supportedProtocols = [
      'http:',
      'https:',
      'mailto:',
      'sms:',
      'tel:'
    ];

    const parsedURL = new URL(url);

    if (!supportedProtocols.includes(parsedURL.protocol)) {
      return 'about:blank';
    }

    return parsedURL.toString().trim();
  } catch (e) {
    console.error('Error parsing URL', e);
    return url;
  }
}

import {$isAtNodeEnd} from '@lexical/selection';
import {$isRootNode, ElementNode, Klass, KlassConstructor, LexicalEditor, LexicalNode, RangeSelection, TextNode} from 'lexical';

export function getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {debounce} from 'lodash-es';
import {useMemo, useRef} from 'react';

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(
    () =>
      debounce(
        (...args: Parameters<T>) => {
          if (funcRef.current) {
            funcRef.current(...args);
          }
        },
        ms,
        {maxWait},
      ),
    [ms, maxWait],
  );
};

export function $getNodeBeforeRoot<T extends LexicalNode>(node: LexicalNode, klass?: Klass<T>): T {
  let currentNode = node;
  while (currentNode.getParent() && !$isRootNode(currentNode.getParent())) {
    currentNode = currentNode.getParent()!;
  }

  if (klass && !(currentNode instanceof klass)) {
    throw new Error(`Expected node to be of type ${klass.name}`);
  }

  return currentNode as T;
}

export function containsNode(
  selection: RangeSelection,
  nodePredicate: (node: LexicalNode) => boolean
): boolean {
  return selection.getNodes().some((node) => {
    let currentNode = node;
    while (currentNode.getParent() && !$isRootNode(currentNode.getParent())) {
      if (nodePredicate(currentNode)) return true;
      currentNode = currentNode.getParent()!;
    }
    return nodePredicate(currentNode);
  });
}

import { $isListItemNode, $isListNode, ListItemNode, ListNode } from '@lexical/list';

export function hasSiblings(node: LexicalNode): boolean {
  const parent = node.getParent();

  if (!parent) {
    return false;
  }

  return (parent && parent.getChildren().length > 1);
};

export function listItemContainsListNode(node: ListItemNode): boolean {
  return node.getChildren().some((child) => $isListNode(child));
}

export function onlyChildIsListNode(node: ListNode): boolean {
  const childrenSize = node.getChildrenSize();

  if (childrenSize === 0) {
    return false;
  }

  const listItemChildren = node.getChildren().filter($isListItemNode);

  if (listItemChildren.length === 0 || listItemChildren.length > 1) {
    return false;
  }

  return listItemContainsListNode(listItemChildren[0]);
}

export type MenuTextMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};

import {
  $getSelection,
  $isRangeSelection,
} from 'lexical';

/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 */
function getFullMatchOffset(
  documentText: string,
  entryText: string,
  offset: number,
): number {
  let triggerOffset = offset;
  for (let i = triggerOffset; i <= entryText.length; i++) {
    if (documentText.substr(-i) === entryText.substr(0, i)) {
      triggerOffset = i;
    }
  }
  return triggerOffset;
}

/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
export function $splitNodeContainingQuery(match: MenuTextMatch): TextNode | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    console.error('Expected a collapsed range selection');
    return null;
  }
  const anchor = selection.anchor;
  if (anchor.type !== 'text') {
    console.log('anchor', anchor.getNode());
    console.error('Expected anchor to be a text node');
    return null;
  }
  const anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) {
    console.error('Expected anchor to be a simple text node');
    return null;
  }
  const selectionOffset = anchor.offset;
  const textContent = anchorNode.getTextContent().slice(0, selectionOffset);
  const characterOffset = match.replaceableString.length;
  const queryOffset = getFullMatchOffset(
    textContent,
    match.matchingString,
    characterOffset,
  );
  const startOffset = selectionOffset - queryOffset;
  if (startOffset < 0) {
    return null;
  }
  let newNode;
  if (startOffset === 0) {
    [newNode] = anchorNode.splitText(selectionOffset);
  } else {
    [, newNode] = anchorNode.splitText(startOffset, selectionOffset);
  }

  return newNode;
}

export function $getNodesFromSelection<T extends LexicalNode>(
  selection: RangeSelection,
  klass: new (...args: any[]) => T
): (T)[] {
  const result = selection.getNodes().map((node) => {
    let currentNode = node;
    while (currentNode.getParent() && !$isRootNode(currentNode.getParent())) {
      if (currentNode instanceof klass) return currentNode;
      currentNode = currentNode.getParent()!;
    }

    if (currentNode instanceof klass) return currentNode;

    return;
  });

  return result.filter((node) => node !== undefined) as T[];
}

export function $getElementsUpToEditorRoot(node: LexicalNode, editor: LexicalEditor): HTMLElement[] {
  const elements = [];
  let currentNode = node;
  while (currentNode.getParent()) {
    if ($isRootNode(currentNode)) {
      break;
    }

    if (currentNode instanceof ElementNode) {
      const elementKey = currentNode.getKey();
      const element = editor.getElementByKey(elementKey);
      elements.push(element);
    }
    currentNode = currentNode.getParent()!;
  }
  return elements.filter((element) => element !== null);
}
