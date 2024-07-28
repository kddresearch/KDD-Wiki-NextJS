// utils/selection-utils.js
import { $getSelection, $isRangeSelection, LexicalEditor, RangeSelection } from "lexical";
import { getNodeBeforeRoot } from ".";
import { $isCodeNode } from "@lexical/code";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";



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
      console.log(topNode.getTag());
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

export function getUnderlineStyling(lexicalSelection: RangeSelection) {
  const isCode = isCodeInSelection(lexicalSelection);

  return {
    isUnderline: lexicalSelection.hasFormat("underline"),
    isDisabled: isCode,
  };
}

export function getStrikethroughStyling(lexicalSelection: RangeSelection) {
  const isCode = isCodeInSelection(lexicalSelection);

  return {
    isStrikethrough: lexicalSelection.hasFormat("strikethrough"),
    isDisabled: isCode,
  };
}