import { fetchById } from "@/app/lib/db/_page";
import TextEditor from "@/components/editors/lexical/editor";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { notFound } from "next/navigation";


async function editPage({ params }: { params: { id: string } }) {

  var page;

  try {
    page = await fetchById(parseInt(params.id));
  } catch (error) {
    console.log(error);
  }

  if (page == null)
    return notFound();

  return (
    <StripeBackDrop>
      <Card title="Edit Page">
        <TextEditor markdown={page.content} />
      </Card>
      <div>editing Page lmao {params.id}</div>
    </StripeBackDrop>
  );
}

export default editPage;
