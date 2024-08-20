import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchByURL } from "@/db/custom_url";
import { fetchById } from "@/db/_page";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { RenderMarkdownString } from "@/components/markdown/markdown";
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
  var page = await fetchById(parseInt(customUrl.target.toString()));

  if (page == null) 
    return notFound();
  const isHTML =
    page.content.trim().startsWith("<") && page.content.trim().endsWith(">");

  title = baseTitle + page.title;

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

  return (
    <StripeBackDrop isRow={true}>
      <div id="nav-wrapper" className="w-1/4 mr-4">
        <Card subTitle="Navigation" className="bg-gray">
          TO BE IMPLEMENTED
        </Card>
      </div>
      <Card title={page.title} smallTitle={page.minutesToReadString} className="grow" actions={<PageOptions/>}>
        {isHTML ? (
          <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline" dangerouslySetInnerHTML={{ __html: page.content }}></div>
        ) : (
          <RenderMarkdownString markdown={page.content}/>
        )}
      </Card>
    </StripeBackDrop>
  );
}

export async function generateMetadata(
  { params }: { params: { slug: string[] } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: title
  }
}

export const revalidate = false