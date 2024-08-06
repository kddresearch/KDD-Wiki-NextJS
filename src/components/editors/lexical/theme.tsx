/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const theme = {
  code: 'bg-lightgray font-mono block px-4 py-4 leading-[1.53] text-sm mt-2 mb-2 tab-[2] overflow-x-auto relative',
  codeHighlight: {
    atrule: 'text-token-attr',
    attr: 'text-token-attr',
    boolean: 'text-token-property',
    builtin: 'text-token-selector',
    cdata: 'text-token-comment',
    char: 'text-token-selector',
    class: 'text-token-function',
    'class-name': 'text-token-function',
    comment: 'text-token-comment',
    constant: 'text-token-property',
    deleted: 'text-token-property',
    doctype: 'text-token-comment',
    entity: 'text-token-operator',
    function: 'text-token-function',
    important: 'text-token-variable',
    inserted: 'text-token-selector',
    keyword: 'text-token-attr',
    namespace: 'text-token-variable',
    number: 'text-token-property',
    operator: 'text-token-operator',
    prolog: 'text-token-comment',
    property: 'text-token-property',
    punctuation: 'text-token-punctuation',
    regex: 'text-token-variable',
    selector: 'text-token-selector',
    string: 'text-token-selector',
    symbol: 'text-token-property',
    tag: 'text-token-property',
    url: 'text-token-operator',
    variable: 'text-token-variable',
  },
  alert: 'bg-black',
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
    listitem: 'ml-8 my-2',
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


import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";


export function Disclaimer() {
  return (
    <Alert variant={"primary"} className="mt-5">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Markdown Support is in Development</AlertTitle>
      <AlertDescription>
        Please be aware that markdown support is still in development and may not work as expected.
      </AlertDescription>
    </Alert>
  )
}

import {
  useEffect,
  useMemo,
  useState
} from 'react';

function Placeholder() {
  const [baseMessage, setBaseMessage] = useState('');
  const [message, setMessage] = useState('');
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const messages = [
      'Start writing in markdown...',
      'Write something...',
      'Type to start writing...',
      'Compose your thoughts...',
      'Markdown magic happens here...'
    ];

    if (!baseMessage) {
      setBaseMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [baseMessage]);

  useEffect(() => {
    if (hasPlayed) return;

    const interval = setInterval(() => {
      setMessage((prev) => {
        if (prev.length === baseMessage.length) {
          setHasPlayed(true);
          return baseMessage;
        }
        return baseMessage.slice(0, prev.length + 1);
      });
    }, 125);

    return () => clearInterval(interval);
  }, [hasPlayed, baseMessage]);

  return (
    <div className='text-gray overflow-hidden absolute text-ellipsis top-[-20px] left-[14px] text-normal select-none inline-block pointer-events-none p-5'>
      <span className="gradient-text font-semibold opacity-65">{message}</span>
      <span
        className="absolute top-0 left-0 p-5 text-transparent gradient-shadow font-semibold opacity-20"
        style={{
          filter: 'blur(2px)',
        }}
      >
        {message}
      </span>
    </div>
  );
}

import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, EditorState } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode, $createCodeHighlightNode } from '@lexical/code';
import { $createAlertNode } from './nodes/alert';
import { $createAlertTitleNode } from './nodes/alert/title';
import { $createAlertDescriptionNode } from './nodes/alert/description';

function populatePlainText(text: string) {
  const root = $getRoot();
  
  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode(text));
  root.append(paragraph);
}

function prePopulate() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {

    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode('Hello, world!'));
    root.append(paragraph);

    const alert = $createAlertNode(
      'Known Issues:',
      'This is a development page. Please do not use it for production.',
      'destructive'
    );
    root.append(alert);

    const default_alert = $createAlertNode(
      'Note:',
      'Starting in .NET 9, a build warning is emitted if your project targets .NET Standard 1.x.',
      'default'
    );
    default_alert.append($createAlertDescriptionNode());
    default_alert.append($createAlertDescriptionNode('For more information, see Warning emitted for .NET Standard 1.x targets.'));
    root.append(default_alert);

    const primary_alert = $createAlertNode(
      'Known Issues:',
      'This is a development page. Please do not use it for production.',
      'primary'
    );
    root.append(primary_alert);

    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Welcome to the KDD Text Editor!'));
    root.append(heading);

    const quote = $createQuoteNode();
    quote.append($createTextNode('Wesley Baldwin is so tired of writing code for this project. He just wants to go to bed.'));
    root.append(quote);

    const codestr = 
`// this is javascript

const x = 5;
console.log(x);`;

    const code = $createCodeNode("js");
    code.append($createCodeHighlightNode(codestr));
    root.append(code);

    const pyCodeStr = 
`# This is python

def foo():
    print("Hello, world!")
    
foo()`;

    const pyCode = $createCodeNode("py");
    pyCode.append($createCodeHighlightNode(pyCodeStr));
    root.append(pyCode);
  }
}

export default theme;

export {
  Placeholder,
  prePopulate,
  populatePlainText
};