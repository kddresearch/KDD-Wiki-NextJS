import { fetchById } from "@/db/_page";
import { AccessLevel } from "@/models/wikiuser";
import NotAuthorized from "@/app/notauthorized/page";
import { checkAuth } from "@/auth";
import TextEditor from "@/components/editors/lexical/editor";
import PageEditor from "@/components/editors/page_editor";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { renderToString } from 'react-dom/server'; // Import renderToString
import { URL } from 'url';
import { deepJsonCopy } from "@/utils/json";

async function editPage({ 
  params 
} : { 
  params: { id: string } 
}) {

  var page;

  try {
    page = await fetchById(parseInt(params.id));
  } catch (error) {
    console.log(error);
  }

  if (page == null)
    return notFound();

  let pageAuthorization = page.is_private ? AccessLevel.Member : AccessLevel.ReadOnly;
  // let pageAuthorization = AccessLevel.Admin;
  let user = await checkAuth(pageAuthorization);

  // const generateRedirectUrl = (message: string) => {
  //   const path = `/notauthorized/?message=${encodeURIComponent(message)}&callback=/page/${params.id}/edit`;
  //   return path;
  // };

  return (
    <StripeBackDrop>
      <Card title="Edit Page">
        <PageEditor inputPage={deepJsonCopy(page)}/>
      </Card>
    </StripeBackDrop>
  );
}

export default editPage;