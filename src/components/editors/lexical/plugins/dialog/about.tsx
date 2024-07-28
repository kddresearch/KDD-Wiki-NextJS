import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import RenderMarkdownStringClient from "@/components/markdown/markdown-client";

function AboutDialog({
  ...props
}:
  DialogProps
) {
  
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
          <RenderMarkdownStringClient markdown={markdown} />
      </DialogContent>
    </Dialog>
  )
}

export default AboutDialog;