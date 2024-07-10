import StripeBackDrop from "@/components/layout/backdrop";
import { notFound, redirect } from "next/navigation";
import { fetchById, fetchByTitle, fetchChildren } from "@/app/lib/db/rpage";
import Card from "@/components/layout/card";
import { RenderMarkdownString } from "@/app/lib/utils/markdown";
import { Pencil } from "react-bootstrap-icons";
import Link from "next/link";
import NavigationCard from "@/components/sidenav";

async function viewPage({ params }: { params: { id: string } }) {
  // check if the id is a number
  const isNumber = !isNaN(parseInt(params.id));

  let page;
  if (isNumber) {
    page = await fetchById(parseInt(params.id));
    if (page == null) return notFound();
    // redirect to the page title
    // redirect(`/rpage/${page.title}`);
  } else {
    page = await fetchByTitle(params.id);
  }

  if (page == null) return notFound();
  const children = await fetchChildren(page.id, 'rpage');

  const PageOptions = () => {
    return (
      <div className="text-lg text-black mb-auto">
        <Link href={`/rpage/${page.id}/edit`} className="flex items-center text-2xl text-purple hover:underline">
          <span className="mr-1"><Pencil color="#512888"/></span>
          Edit
        </Link>
      </div>
    );
  };

  if (page.content == null) {
    page.content = "";
  }

  const isHTML =
    page.content.trim().startsWith("<") && page.content.trim().endsWith(">");

  return (
    <StripeBackDrop isRow={true}>
      {children.length > 0 && (
        <div id="nav-wrapper" className="w-1/4 mr-4">
          <NavigationCard children={children} />
        </div>
      )}
      <Card title={page.title} className="mx-4" actions={<PageOptions />}>
        {isHTML ? (
          <div className="mt-4 prose max-w-none prose-a:text-purple prose-a:underline" dangerouslySetInnerHTML={{ __html: page.content }}></div>
        ) : (
          <RenderMarkdownString markdown={page.content} />
        )}
      </Card>
    </StripeBackDrop>
  );
}

export default viewPage;
