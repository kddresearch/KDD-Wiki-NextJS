import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import dynamic from "next/dynamic";

// const LexicalEditor = dynamic(() => import('@/components/editors/lexical/editor'), { ssr: false });

import TextEditor from "@/components/editors/lexical/editor";
import { LexicalEditor2 } from "@/components/editors/lexical/editor";

function devEditorPage() {
  return (
    <StripeBackDrop>
      <LexicalEditor2/>
      <TextEditor/>
      {/* <Card title="My Editor">
        hello
      </Card>
      <Card title="Why does this work?">
        HELLO
      </Card> */}
    </StripeBackDrop>
  )
}

export default devEditorPage;