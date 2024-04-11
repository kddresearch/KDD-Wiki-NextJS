import BackDrop from "@/components/page/backdrop";
import { notFound, redirect } from "next/navigation";
import { fetchById, fetchByName } from "@/app/lib/db/page";
import Card from "@/components/page/card";

import { remark } from "remark";
import html from "remark-html";

async function pageView({ params }: { params: { id: string } }) {
  // check if the id is a number
  const isNumber = !isNaN(parseInt(params.id));

  if (isNumber) {
    var page = await fetchById(parseInt(params.id));

    if (page == null) return notFound();
    //redirect to the page name
    redirect(`/page/${page.name}`);
  } else {
    var page = await fetchByName(params.id);

    if (page == null) return notFound();
  }

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

export default pageView;
