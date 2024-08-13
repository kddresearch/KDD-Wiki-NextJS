"use client";

import StripeBackDrop from "@/components/layout/backdrop"
import Card from "@/components/layout/card"
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BoxArrowUpRight, Github } from "react-bootstrap-icons";
import IssueReportButton from "@/components/buttons/report";

export default function NotAuthorized() {
  const pathname = usePathname();

  const message = useSearchParams()?.get("message");
  const error = useSearchParams()?.get("error");
  const callback = useSearchParams()?.get("callback");

  console.log("NotAuthorized:", {message, error, callback});

  return( 
    <StripeBackDrop>
      <Card isFlex={false} title="401: Not Authorized" actions={<IssueReportButton pathname={pathname} type="general"/>}>
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
