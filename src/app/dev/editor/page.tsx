import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import dynamic from "next/dynamic";

// const LexicalEditor = dynamic(() => import('@/components/editors/lexical/editor'), { ssr: false });

import LexicalEditor from "@/components/editors/lexical/editor";

function devEditorPage() {
  return (
    <StripeBackDrop>
      <Card title="Editor">
        <LexicalEditor/>
      </Card>
    </StripeBackDrop>
  )
}

export default devEditorPage;