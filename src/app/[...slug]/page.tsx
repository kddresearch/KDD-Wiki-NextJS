import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchByURL } from "../lib/db/custom_url";
import { fetchByName, fetchById } from "../lib/db/_page";
import { number } from "joi";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { remark } from "remark";
import html from "remark-html";
import { UserActivity } from "../lib/models/user_activity";
import { RenderMarkdownString } from "../lib/utils/markdown";
import { Metadata, ResolvingMetadata } from "next";

const baseTitle = "KSU KDD Wiki: ";
let title: string;

export default async function Page({ 
  params 
}: { params: { slug: string[] } }) {
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

  const contentHTML = page.content;
  return (
    <StripeBackDrop isRow={true}>
      <div id="nav-wrapper" className="w-1/4 mr-4">
        <Card subTitle="Navigation" className="bg-gray">
          TO BE IMPLEMENTED

          Add a dynamic table of contents and create that page tree system uhhggggg
        </Card>
      </div>
      <Card title={page.title} className="grow">
        {isHTML ? (
          <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline" dangerouslySetInnerHTML={{ __html: contentHTML }}></div>
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