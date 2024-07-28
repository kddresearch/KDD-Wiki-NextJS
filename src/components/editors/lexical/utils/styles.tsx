// utils/selection-utils.js
import { $getSelection, $isRangeSelection, LexicalEditor, RangeSelection } from "lexical";
import { containsNode, getNodeBeforeRoot } from ".";
import { $isCodeNode } from "@lexical/code";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $isLinkNode } from "@lexical/link";



export function isCodeInSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const topNode = getNodeBeforeRoot(node);
    return $isCodeNode(topNode);
  });
}

function isH1InSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const topNode = getNodeBeforeRoot(node);
    if ($isHeadingNode(topNode)) {
      return topNode.getTag() === 'h1';
    }
    return false;
  });
}

function isQuoteInSelection(lexicalSelection: RangeSelection) {
  return lexicalSelection.getNodes().some((node) => {
    const topNode = getNodeBeforeRoot(node);
    return topNode.getType() === 'quote';
  });
}

function isLinkInSelection(lexicalSelection: RangeSelection) {
  return containsNode(lexicalSelection, $isLinkNode);
}



export function getBoldStyling(lexicalSelection: RangeSelection) {
  const isCode = isCodeInSelection(lexicalSelection);
  const isH1 = isH1InSelection(lexicalSelection);

  const isDisabled = isH1 || isCode;

  return {
    isBold: lexicalSelection.hasFormat("bold") || isH1,
    isDisabled: isDisabled,
  };
}

export function getItalicStyling(lexicalSelection: RangeSelection) {
  const isCode = isCodeInSelection(lexicalSelection);
  const isH1 = isH1InSelection(lexicalSelection);
  const isQuote = isQuoteInSelection(lexicalSelection);

  return {
    isItalic: lexicalSelection.hasFormat("italic") || isQuote,
    isDisabled: isCode || isQuote || isH1,
  };
}

export function getStrikethroughStyling(lexicalSelection: RangeSelection) {
  const isCode = isCodeInSelection(lexicalSelection);

  return {
    isStrikethrough: lexicalSelection.hasFormat("strikethrough"),
    isDisabled: isCode,
  };
}