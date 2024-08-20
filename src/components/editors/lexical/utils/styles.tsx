import {
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  RangeSelection
} from "lexical";
import {
  containsNode,
  $getNodeBeforeRoot
} from ".";
import { $isCodeNode } from "@lexical/code";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isLinkNode } from "@lexical/link";
import { $isMakrdownEditorCodeNode } from "../nodes/markdown";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";

export function isAlertTitleInSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const elementNode = $getNearestBlockElementAncestorOrThrow(node);
    return elementNode.getType() === 'alert-title';
  });
}

export function isMarkdownEditorCodeInSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const topNode = $getNodeBeforeRoot(node);
    return $isMakrdownEditorCodeNode(topNode);
  });
}

export function isCodeInSelection(lexicalSelection: RangeSelection) {
  const result = isMarkdownEditorCodeInSelection(lexicalSelection);

  if (result) {
    return false;
  }

  return lexicalSelection.getNodes().some((node) => {
    const topNode = $getNodeBeforeRoot(node);
    return $isCodeNode(topNode);
  });
}

function isH1InSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const topNode = $getNodeBeforeRoot(node);
    if ($isHeadingNode(topNode)) {
      return topNode.getTag() === 'h1';
    }
    return false;
  });
}

function isQuoteInSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const topNode = $getNodeBeforeRoot(node);
    return topNode.getType() === 'quote';
  });
}

function isLinkInSelection(lexicalSelection: RangeSelection) {
  return containsNode(lexicalSelection, $isLinkNode);
}



export function getBoldStyling(lexicalSelection: RangeSelection) {
  const isMarkdownEditor = isMarkdownEditorCodeInSelection(lexicalSelection);
  const isAlertTitle = isAlertTitleInSelection(lexicalSelection);
  const isCode = isCodeInSelection(lexicalSelection);
  const isH1 = isH1InSelection(lexicalSelection);

  const isDisabled = isH1 || isCode || isMarkdownEditor || isAlertTitle;

  return {
    isBold: lexicalSelection.hasFormat("bold") || isH1 || isAlertTitle,
    isDisabled: isDisabled,
  };
}

export function getItalicStyling(lexicalSelection: RangeSelection) {
  const isMarkdownEditor = isMarkdownEditorCodeInSelection(lexicalSelection);
  const isCode = isCodeInSelection(lexicalSelection);
  const isH1 = isH1InSelection(lexicalSelection);
  const isQuote = isQuoteInSelection(lexicalSelection);

  return {
    isItalic: lexicalSelection.hasFormat("italic") || isQuote,
    isDisabled: isCode || isQuote || isH1 || isMarkdownEditor,
  };
}

export function getStrikethroughStyling(lexicalSelection: RangeSelection) {
  const isMarkdownEditor = isMarkdownEditorCodeInSelection(lexicalSelection);
  const isCode = isCodeInSelection(lexicalSelection);

  return {
    isStrikethrough: lexicalSelection.hasFormat("strikethrough"),
    isDisabled: isCode || isMarkdownEditor,
  };
}

export function getLinkStyling(lexicalSelection: RangeSelection) {
  const isMarkdownEditor = isMarkdownEditorCodeInSelection(lexicalSelection);
  const isCode = isCodeInSelection(lexicalSelection);
  const elementsDisabled = getElementsDisabled(lexicalSelection);

  return {
    isLink: isLinkInSelection(lexicalSelection),
    isDisabled: isCode || isMarkdownEditor || elementsDisabled.isDisabled,
  };
}

export function getElementsDisabled(lexicalSelection: RangeSelection) {
  const isMarkdownEditor = isMarkdownEditorCodeInSelection(lexicalSelection);
  const isCode = isCodeInSelection(lexicalSelection);

  return {
    isDisabled: isMarkdownEditor,
  };
}