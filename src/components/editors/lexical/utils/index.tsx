

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// FROM https://github.com/facebook/lexical/blob/6558e2299896a8804e6c064b4c40946208649732/packages/shared/src/canUseDOM.ts#L9
export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

// FROM https://github.com/facebook/lexical/blob/main/packages/shared/src/environment.ts
const IS_FIREFOX: boolean =
  CAN_USE_DOM && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);

// FROM https://github.com/facebook/lexical/blob/main/packages/lexical-utils/src/index.ts#L534

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