"use client";

import Breadcrumb from "@/components/breadcrumb";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import TextEditor from "@/components/editors/lexical/editor";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"
import { InfoIcon, Terminal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Dev = () => {

  const [currentMarkdownContent, setCurrentMarkdownContent] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const onMarkdownContentChange = (newMarkdownContent: string) => {
    console.log(newMarkdownContent);
    setCurrentMarkdownContent(newMarkdownContent);
  }

  const defaultMarkdownContent = `
> [!NOTEing:|destructive]
> woah this is the DEV PAGE bro idk if you should be here.
> errmmm

> [!NOTEing:|primary]
> Starting in .NET 9, a build warning is emitted if your project targets .NET Standard 1.x.
> 
> For more information, see Warning emitted for .NET Standard 1.x targets.

> [!NOTEing:|default]
> if you find this please fix my bugs bro please please please
> pls pls pls pls pls pls

> I hope that quotes still work too... lol

### This list is fine

- HELLO 1
- WORLD 1
    - TESTING 2
        - INDENTING 3

### This list is weird

- HELLO 1
- WORLD 1
- TESTING 2
        - INDENTING 3
`.trim();

  return (
    <div className="h-full flex flex-col">
      <Breadcrumb />

      <StripeBackDrop>
        <Card title="hello testing">
          <TextEditor usePrePopulated={true} />
        </Card>
        <Card title="Testing the markdown">
          <TextEditor
            markdown={defaultMarkdownContent}
          />
        </Card>
        <Card title="hello testing">THIS IS THE NEW VERSION pushed from the azure registry</Card>
        <Card title="hello testing">dwa id</Card>
        <Card title="hello testing"> dwahidahi</Card>

      </StripeBackDrop>
    </div>
  );
};

export default Dev;
