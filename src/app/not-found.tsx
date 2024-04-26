"use client";

import Breadcrumb from "@/components/breadcrumb";
import Link from "next/link";
import Nav from "next/navigation";
import { usePathname } from "next/navigation";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";

export default function NotFound() {
  const pathname = usePathname();

  const ReportRedirect = () => {
    return (
      <Link
        className="bg-lightgray text-xl text-black p-1 rounded-md my-auto font-normal"
        href={`/report/404?page=${pathname}`}
      >
        Report{" "}
        <span>
          <BoxArrowUpRight className="inline" />
        </span>
      </Link>
    )
  }

  return (
    <StripeBackDrop>
      <Card isFlex={false} title="404: Page Not Found" actions={<ReportRedirect/>} className="">
        <div className="flex flex-row">
          <h1 className="text-purple text-4xl md:text-6xl font-bold grow">
          </h1>

        </div>
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
  );
}

// how do I find the request path?
// A: You can use the useRouter hook from next/router to get the current path
