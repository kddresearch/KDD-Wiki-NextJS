"use client";

import StripeBackDrop from "@/components/layout/backdrop"
import Card from "@/components/layout/card"
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BoxArrowUpRight, Github } from "react-bootstrap-icons";
import getConfig from "@/config";
const config = await getConfig();

export default function NotAuthorized() {

  const message = useSearchParams()?.get("message");
  const callback = useSearchParams()?.get("callback");

  const baseGithubUrl = new URL(`https://github.com/${config!.github!.owner}/${config!.github!.repo}`);

  // TODO: Implement a way to report unauthorized access
  const ReportRedirect = () => {
    return (
      <Link
        className="bg-lightgray text-xl text-black p-1 rounded-md my-auto font-normal"
        href={baseGithubUrl.toString()}
      >
        Report
        <span className="ml-2">
          <BoxArrowUpRight className="inline" />
        </span>
      </Link>
    )
  }

  return( 
    <StripeBackDrop>
      <Card isFlex={false} title="401: Not Authorized" actions={<ReportRedirect/>}>
        <p className="my-2 inline-block">
          You are not authorized to access requested resource at
          <span className="inline-block bg-lightgray p-1 mx-1 rounded-md max-w-48 md:max-w-xs lg:max-w-sm xl:max-w-3xl overflow-hidden truncate align-middle">
            {callback}
          </span>
        </p>
        <p className="my-2 text-3xl font-bold">
          {message}
        </p>
        <Link className="bg-lightgray p-1 rounded-md" href="/">
          Return Home
        </Link>
      </Card>
    </StripeBackDrop>
  );
}
