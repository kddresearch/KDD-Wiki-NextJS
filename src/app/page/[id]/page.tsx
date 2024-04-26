import StripeBackDrop from "@/components/layout/backdrop";
import { notFound, redirect } from "next/navigation";
import { fetchById, fetchByName } from "@/app/lib/db/_page";
import Card from "@/components/layout/card";

import { remark } from "remark";
import html from "remark-html";
import { RenderMarkdownString } from "@/app/lib/utils/markdown";
import { Pencil } from "react-bootstrap-icons";
import Link from "next/link";

async function viewPage({ params }: { params: { id: string } }) {
  // check if the id is a number
  const isNumber = !isNaN(parseInt(params.id));

  if (isNumber) {
    var page = await fetchById(parseInt(params.id));

    if (page == null) return notFound();
    //redirect to the page name
    redirect(`/page/${page.name}`);
  } else {
    var page = await fetchByName(params.id);

  }

  if (page == null)
    return notFound();

  const PageOptions = () => {
    return (
      <div className="text-lg text-black mb-auto">
        <Link href={page?.editUrl!} className="flex items-center text-2xl text-purple hover:underline">
          <span className="mr-1"><Pencil color="#512888"/></span>
          Edit
        </Link>
      </div>
    );
  };

  const isHTML =
    page.content.trim().startsWith("<") && page.content.trim().endsWith(">");

  return (
    <StripeBackDrop isRow={true}>
      <div id="nav-wrapper" className="w-1/4 mr-4">
        <Card subTitle="Navigation" className="bg-gray">
          TO BE IMPLEMENTED
        </Card>
      </div>
      <Card title={page.title} smallTitle={page.minutesToReadString} className="mx-4" actions={<PageOptions/>}>
        {isHTML ? (
          <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline" dangerouslySetInnerHTML={{ __html: page.content }}></div>
        ) : (
          <RenderMarkdownString markdown={page.content}/>
        )}
      </Card>
    </StripeBackDrop>
  );
}

export default viewPage;
