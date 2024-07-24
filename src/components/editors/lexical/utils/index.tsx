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
import {$isRootNode, ElementNode, LexicalNode, RangeSelection, TextNode} from 'lexical';

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
}

export function getNodeBeforeRoot(node: LexicalNode): LexicalNode {
  let currentNode = node;
  while (currentNode.getParent() && !$isRootNode(currentNode.getParent())) {
    currentNode = currentNode.getParent()!;
  }
  return currentNode;
}