"use client";

import { Combobox } from "@/components/ui/combo-box";
import { $isCodeNode, getCodeLanguages, getLanguageFriendlyName } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Label } from "@radix-ui/react-label";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { getSelectedNode } from "../../utils";
import React, { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

interface CodeDropdownProps extends React.HTMLProps<HTMLDivElement> {
  editor: LexicalEditor;
}

function CodeDropdown({
  editor,
  ...props
}:
  CodeDropdownProps
) {
  const languages = getCodeLanguages().map((language) => {
    return {
      value: language,
      label: getLanguageFriendlyName(language),
    };
  });

  const [codeLanguage, setCodeLanguage] = useState<undefined | string>(undefined);

  const updateDropdown = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    let node = getSelectedNode(selection);
    let codeNode = null;

    // Get all nodes up to the parent
    while (node !== null) {

      if ($isCodeNode(node)) {
        codeNode = node;
        break;
      }

      if (node.getParent() === null) {
        break;
      } else {
        node = node.getParent()!;
      }
    }

    if (codeNode === null) {
      return;
    }

    const language = codeNode.getLanguage()!;

    if (language === "plaintext") {
      setCodeLanguage(undefined);
      return;
    }

    setCodeLanguage(language);
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateDropdown();
        });
      }),
    );
  }, [editor, updateDropdown]);

  const onSelectLanguage = (language: string) => {

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      let node = getSelectedNode(selection);
      let codeNode = null;

      // Get all nodes up to the parent
      while (node !== null) {

        if ($isCodeNode(node)) {
          codeNode = node;
          break;
        }

        if (node.getParent() === null) {
          break;
        } else {
          node = node.getParent()!;
        }
      }

      if (codeNode === null) {
        return;
      }

      setCodeLanguage(language);
      codeNode.setLanguage(language);
    });
  };

  return (
    <div 
      className={
        cn(
          "flex align-middle h-10 gap-1",
          props.className
        )}
      {...props}
    >
      <Label className="my-auto text-sm">Language: </Label>
      <Combobox
        options={languages}
        defaultSelect={codeLanguage}
        onSelect={onSelectLanguage}
        type="language"
      />
    </div>
  );
}

export default CodeDropdown;