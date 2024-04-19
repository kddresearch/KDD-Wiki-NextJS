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

export default async function Page({ params }: { params: { slug: string[] } }) {
  const url = params.slug.join("/");

  const customUrl = await fetchByURL(url);
  if (customUrl == null) {
    notFound();
  }

  var page = await fetchById(parseInt(customUrl.target.toString()));

  if (page == null) return notFound();

  const isHTML =
    page.content.trim().startsWith("<") && page.content.trim().endsWith(">");

  var contentHTML;

  if (!isHTML) {
    const processedContent = await remark().use(html).process(page.content);
    contentHTML = processedContent.toString();
  } else {
    contentHTML = page.content;
  }
  return (
    <StripeBackDrop isRow={true}>
      <Card title={page.title + page.id.toString()} className="mx-4">
        <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline">
          <div dangerouslySetInnerHTML={{ __html: contentHTML }}></div>
        </div>
      </Card>
    </StripeBackDrop>
  );
}
