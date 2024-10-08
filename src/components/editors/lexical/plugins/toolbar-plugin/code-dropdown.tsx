"use client";

import { Combobox } from "@/components/ui/combo-box";
import { $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, getCodeLanguages, getLanguageFriendlyName } from "@lexical/code";
import { Label } from "@radix-ui/react-label";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $getNodeBeforeRoot, getSelectedNode } from "../../utils";
import React, { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";

import { cn } from "@/lib/utils"
import { $isMakrdownEditorCodeNode } from "../../nodes/markdown";

interface CodeDropdownProps extends React.HTMLProps<HTMLDivElement> {
  editor: LexicalEditor;
}

function CodeDropdown({
  editor,
  ...props
}:
  CodeDropdownProps
) {
  const getUniqueLanguages = () => {
    const options = [];
  
    for (const [lang, friendlyName] of Object.entries(
      CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    )) {
      options.push({value: lang, label: friendlyName});
    }
  
    return options;
  }

  const uniqueLanguages = getUniqueLanguages();

  const [codeLanguage, setCodeLanguage] = useState<undefined | string>(undefined);

  const updateDropdown = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    const node = getSelectedNode(selection);
    const codeNode = $getNodeBeforeRoot(node);

    if (!$isCodeNode(codeNode)) {
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

      const node = getSelectedNode(selection);
      const codeNode = $getNodeBeforeRoot(node);
  
      if (!$isCodeNode(codeNode)) {
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
      <Combobox
        options={uniqueLanguages}
        defaultSelect={codeLanguage}
        onSelect={onSelectLanguage}
        type="language"
      />
    </div>
  );
}

export default CodeDropdown;