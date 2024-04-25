import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { RenderMarkdownFile } from "@/app/lib/utils/markdown";
import path from 'path';

const COPYRIGHTFILE = path.join(process.cwd(), 'LICENSE.md');

async function copyrightPage() {
  return (
    <StripeBackDrop>
        <Card>
          <div className="m-4 p-4 font-mono bg-gray border-gray border rounded-lg"> 
            <RenderMarkdownFile filePath={COPYRIGHTFILE} />
          </div>
        </Card>
    </StripeBackDrop>
  )
}

export default copyrightPage;