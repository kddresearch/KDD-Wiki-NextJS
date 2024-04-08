import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";

// open markdown file
import fs from 'fs';
import path from 'path';


import { remark } from "remark";
import html from "remark-html";

// convert markdown to html

async function copyrightPage() {

  // get markdown file
  const markdownFile = path.join(process.cwd(), 'LICENSE.md');

  // read markdown file
  const markdown = fs.readFileSync(markdownFile, 'utf-8');

  // const html = await remark().use(remarkHtml).process(markdown);
  const processedContent = await remark().use(html).process(markdown);
  var contentHTML = processedContent.toString();

  return (
    <BackDrop>
      <Card>
        <div className="m-4 p-4 font-mono bg-gray border-gray border rounded-lg"> 
          <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: contentHTML }}></div>
          </div>
        </div>
      </Card>
    </BackDrop>
  )
}

export default copyrightPage;