import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchByURL } from "../lib/db/custom_url";
import { fetchById } from "../lib/db/rpage";
import { number } from "joi";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { remark } from "remark";
import html from "remark-html";
import { UserActivity } from "../lib/models/user_activity";
import { RenderMarkdownString } from "../lib/utils/markdown";
import { Metadata, ResolvingMetadata } from "next";
import { Pencil } from "react-bootstrap-icons";

const baseTitle = "KSU KDD Wiki: ";
let title: string;

export default async function Page({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  const url = params.slug.join("/");
  const customUrl = await fetchByURL(url);
  if (customUrl == null) {
    notFound();
  }
  console.log("here")
  var page = await fetchById(parseInt(customUrl.target.toString()));

  if (page == null) 
    return notFound();

  if (page.content == null){
    page.content = "";
  }

  const isHTML =
    page.content.trim().startsWith("<") && page.content.trim().endsWith(">")

  title = baseTitle + page.title;
  // {page?.editUrl!}
  const PageOptions = () => {
    return (
      <div className="text-lg text-black mb-auto">
        <Link href="test" className="flex items-center text-2xl text-purple hover:underline">
          <span className="mr-1"><Pencil color="#512888"/></span>
          Edit
        </Link>
      </div>
    );
  };

  return (
    <StripeBackDrop isRow={true}>
      <div id="nav-wrapper" className="w-1/4 mr-4">
        <Card subTitle="Navigation" className="bg-gray">
          TO BE IMPLEMENTED
        </Card>
      </div> 
      <Card title={page.title} className="grow" actions={<PageOptions/>}> 
        {isHTML ? (
          <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline" dangerouslySetInnerHTML={{ __html: page.content }}></div>
        ) : (
          <RenderMarkdownString markdown={page.content}/>
        )}
      </Card>
    </StripeBackDrop>
  );
}
// smallTitle={page.minutesToReadString}

export async function generateMetadata(
  { params }: { params: { slug: string[] } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: title
  }
}