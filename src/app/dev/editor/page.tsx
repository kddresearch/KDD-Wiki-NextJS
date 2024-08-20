import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";

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