"use client";

import { $isElementNode, $isTextNode, RangeSelection } from "lexical";
import Typo from "typo-js";
import localForage from 'localforage';

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
  const path = "/dictionaries";

  if (dictionaryInstance) {
    return Promise.resolve(dictionaryInstance);
  }

  let cache = await dictionaryCache.getItem(dictionary) as dictionaryCache | null;

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
        cache.affData = data;
        dictionaryCache.setItem(dictionary, cache);
      });
  }

  if (!cache.wordsData) {
    fetch(`${path}/${dictionary}/${dictionary}.dic`)
      .then(response => response.text())
      .then(data => {
        cache.wordsData = data;
        dictionaryCache.setItem(dictionary, cache);
      });
  }

  dictionaryInstance = new Typo(dictionary, cache.affData, cache.wordsData);
  return dictionaryInstance;
}

export function getWord(selection: RangeSelection): string | null {

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

export async function isWordMisspelled(word: string) {
  const start = performance.now();
  const result = getCachedDictionary().then(dictionary => !dictionary.check(word.toLocaleLowerCase()));

  // // wait 1 ms to get the result
  // await new Promise(resolve => setTimeout(resolve, 10));

  const end = performance.now();

  console.log(`isWordMisspelled took ${end - start} ms`);

  return result;
}