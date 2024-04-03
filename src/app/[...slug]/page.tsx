import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchByURL } from "../lib/db/custom_url";
import { fetchByName, fetchById } from "../lib/models/page";
import { number } from "joi";
import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";
import { remark } from "remark";
import html from "remark-html";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const url = params.slug.join("/");

  const customUrl = await fetchByURL(url);
  if (customUrl == null) {
    notFound();
  }

  // TODO: fix the target type
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
    <BackDrop isRow={true}>
      <Card title={page.title + page.id.toString()} className="mx-4">
        <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline">
          <div dangerouslySetInnerHTML={{ __html: contentHTML }}></div>
        </div>
      </Card>
    </BackDrop>
  );
}
