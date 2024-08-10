"use client";

import { $isElementNode, $isTextNode, LexicalEditor, RangeSelection } from "lexical";
import Typo from "typo-js";
import localForage from 'localforage';
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";

const dictionaryCache = localForage.createInstance({
  name: 'dictionary-cache',
});

let dictionaryInstance: null | Typo = null;

type dictionaryCache = {
  affData: string | null;
  wordsData: string | null;
}

async function getCachedDictionary(): Promise<Typo> {
  const dictionary = "en_US";
  const path = "./dictionaries";

  if (dictionaryInstance) {
    return Promise.resolve(dictionaryInstance);
  }

  let cache = await dictionaryCache.getItem(dictionary) as dictionaryCache | null;

  if (cache) {
    console.log("Resolved dictionary from cache");
  }

  if (!cache) {
    cache = {
      affData: null,
      wordsData: null,
    };
  }

  if (!cache.affData) {
    fetch(`${path}/${dictionary}/${dictionary}.aff`)
      .then(response => response.text())
      .then(data => {
        console.log("Resolving affData from network");
        cache.affData = data;
        dictionaryCache.setItem(dictionary, cache);
      });
  }

  if (!cache.wordsData) {
    fetch(`${path}/${dictionary}/${dictionary}.dic`)
      .then(response => response.text())
      .then(data => {
        console.log("Resolving wordsData from network");
        cache.wordsData = data;
        dictionaryCache.setItem(dictionary, cache);
      });
  }

  dictionaryInstance = new Typo(dictionary, cache.affData, cache.wordsData);
  return dictionaryInstance;
}

function elementEnablesSpellcheck(element: Element): boolean {
  // if element has no childElements

  const spellcheck = element.getAttribute('spellcheck') !== 'false';

  if (!spellcheck) {
    return spellcheck;
  }

  if (element.children.length === 0) {
    return spellcheck;
  }

  // check child elements
  const childElements = element.querySelectorAll('*');

  return Array.from(childElements).every(childElement => {
    return elementEnablesSpellcheck(childElement);
  });
}

export function spellcheckIsEnabledOnSelection(selection: RangeSelection, editor: LexicalEditor): boolean {
  const nodes = selection.getNodes();
  const elementNodes = nodes.map((node) => {
    return $getNearestBlockElementAncestorOrThrow(node);
  });

  let result;

  result = elementNodes.every(node => {
    const nodeElement = editor.getElementByKey(node.getKey());

    // if element has no childElements
    if (!nodeElement) {
      console.log('Element not found:', node);
      return true;
    }

    return elementEnablesSpellcheck(nodeElement);
  });

  console.log('Result:', result);

  if (result === undefined) {
    return true;
  }

  return result;
}

export function getWord(selection: RangeSelection, editor: LexicalEditor): string | null {
  if (selection.isCollapsed()) {
    const anchorNodeText = selection.anchor.getNode().getTextContent();
    const anchorOffset = selection.anchor.offset;

    let start = anchorOffset;
    let end = anchorOffset;

    // only get word if the anchor is in a text node
    if (anchorNodeText.length === 0) {
      return null;
    }

    // does not equal alphanumeric character 
    if (!/\w/.test(anchorNodeText[anchorOffset])) {
      return null;
    }
    while (start > 0 && /[a-zA-Z]/.test(anchorNodeText[start - 1])) {
      start--;
    }

    while (end < anchorNodeText.length && /[a-zA-Z]/.test(anchorNodeText[end])) {
      end++;
    }

    return anchorNodeText.slice(start, end);
  }

  const selectedText = selection.getTextContent();
  const first = selection.anchor.isBefore(selection.focus) ? selection.anchor : selection.focus;
  const last = selection.anchor.isBefore(selection.focus) ? selection.focus : selection.anchor;

  const nodes = selection.getNodes();
  const areTextNodes = nodes.every(node => $isTextNode(node));

  // Dont support multiline words
  if (!areTextNodes) {
    return null;
  }

  const firstPrevChar = first.getNode().getTextContent().slice(first.offset - 1, first.offset);
  const lastNextChar = last.getNode().getTextContent().slice(last.offset, last.offset + 1);
  const selectedIsWord = !/[^a-z^A-Z]+/.test(selectedText);

  if (!selectedIsWord) {
    return null;
  }

  if (!/[a-zA-Z]+/.test(firstPrevChar) && !/[a-zA-Z]+/.test(lastNextChar)) {
    return selectedText;
  }

  return null;
}

export async function loadTypo() {
  return getCachedDictionary();
}

export async function isWordMisspelled(word: string) {
  const result = getCachedDictionary().then(dictionary => !dictionary.check(word.toLocaleLowerCase()));

  return result;
}