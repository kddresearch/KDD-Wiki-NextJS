"use client";

import Breadcrumb from "@/components/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { URL } from 'whatwg-url';
import IssueReportButton from "@/components/buttons/report";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <StripeBackDrop>
      <Card isFlex={false} title="404: Page Not Found" actions={<IssueReportButton pathname={pathname} type="missing"/>} className="">
        <p className="my-4 inline-block">
          Requested resource at
          <span className="inline-block bg-lightgray p-1 mx-1 rounded-md max-w-48 md:max-w-xs lg:max-w-sm xl:max-w-3xl overflow-hidden truncate align-middle">
            {pathname}
          </span>
          could not be found.
        </p>
        <p className="my-4"></p>
        <Link className="bg-lightgray p-1 rounded-md" href="/">
          Return Home
        </Link>
      </Card>
    </StripeBackDrop>
    // <div>
    //   hello world
    // </div>
  );
}
