import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import RenderMarkdownStringClient from "@/components/markdown/markdown-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


function LoadingComponent() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[350px]" />
      <Skeleton className="h-4 w-[250px]" />
      <div className="h-4"></div>
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[375px]" />
      <div className="h-4"></div>
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[375px]" />
      <Skeleton className="h-4 w-[325px]" />
      <Skeleton className="h-4 w-[100px]" />
      <div className="h-4"></div>
      <Skeleton className="h-4 w-[250px]" />
    </div>
  );
}

function AboutDialog({
  ...props
}: DialogProps) {
  
  const githubLink = "https://github.com/kddresearch/KDD-Wiki-NextJS/tree/main/src/components/editors/lexical";

  const markdown = `
  The KDD Editor is created and maintained in house as a simple yet powerful
  Markdown WYSIWYG *(What You See Is What You Get)* editor.

  The code can be found on the github page, at
  [/src/components/editors/lexical](${githubLink}).

  This is built upon the amazing work of the Meta team, who created the
  Lexical editor. The Lexical editor is a powerful, flexible, and extensible
  editor for creating and editing structured documents.

  © 2024 Kansas State University
  `;

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>The KDD Editor</DialogTitle>
        </DialogHeader>
        
        <Suspense fallback={<LoadingComponent />}>
          <RenderMarkdownStringClient markdown={markdown} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default AboutDialog;