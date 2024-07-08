/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = {
  code: 'bg-[#f0f2f5] font-mono block px-4 py-4 leading-[1.53] text-[13px] mt-2 mb-2 tab-[2] overflow-x-auto relative',
  // heading: {
  //     h1: '',
  //     h2: '',
  //     h3: '',
  //     h4: '',
  //     h5: '',
  // },
  // image: 'editor-image',
  // link: 'text-purple underline',
  list: {
    listitem: 'mx-8 my-2',
    nested: {
      listitem: 'list-none',
    },
    ol: 'pl-4 m-0',
    ul: 'pl-4 m-0',
  },
  // ltr: 'text-left',
  // paragraph: 'mb-2 relative',
  // placeholder: 'text-gray-500 overflow-hidden absolute text-ellipsis top-4 left-2.5 text-base pointer-events-none inline-block',
  // quote: 'm-0 ml-5 text-base text-[rgb(101,103,107)] border-l-4 border-[rgb(206,208,212)] pl-4 italic',
  // rtl: 'text-right',
  text: {
    bold: 'font-bold',
    code: 'bg-[rgb(240,242,245)] px-1 py-0.5 font-mono text-[94%]',
    // hashtag: '/* No direct Tailwind equivalent for this class */',
    italic: 'italic',
    // overflowed: '/* No direct Tailwind equivalent for this class */',
    strikethrough: 'line-through',
    underline: 'underline',
    underlineStrikethrough: 'underline-strikethrough',
    },
  tokenAnsi: {
    comment: 'text-slate-500',
    punctuation: 'text-gray-500',
    property: 'text-[#905]',
    selector: 'text-[#690]',
    operator: 'text-[#9a6e3a]',
    attrName: 'text-[#07a]',
    variableName: 'text-[#e90]',
    functionName: 'text-[#dd4a68]',
  },
};

function Placeholder() {
  return <div className="text-gray overflow-hidden absolute text-ellipsis top-[0px] left-[38px] text-normal select-none inline-block pointer-events-none">
    Enter some rich text...
  </div>;
}

import { $createTextNode, $getRoot, $getSelection, EditorState } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';

function prePopulate() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Welcome to the KDD Text Editor!'));
    root.append(heading);

    const quote = $createQuoteNode();
    quote.append($createTextNode('Wesley Baldwin is so tired of writing code for this project. He just wants to go to bed.'));
    root.append(quote);

    const code = $createCodeNode();
    code.append($createTextNode('const x = 5;'));
    root.append(code);
  }
}

export default theme;

export {
  Placeholder,
  prePopulate
};