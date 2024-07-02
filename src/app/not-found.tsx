"use client";

import Breadcrumb from "@/components/breadcrumb";
import Link from "next/link";
import Nav from "next/navigation";
import { usePathname } from "next/navigation";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { URL } from 'whatwg-url';
import getConfig from "@/config";
const config = await getConfig();

export default function NotFound() {

  const pathname = usePathname();

  const baseGithubUrl = new URL(`https://github.com/${config!.github!.owner}/${config!.github!.repo}/issues/new`);
  baseGithubUrl.searchParams.append("assignees", `${config!.github!.maintainers.join(",")}`);
  baseGithubUrl.searchParams.append("labels", "missing content");
  baseGithubUrl.searchParams.append("template", "report-page-missing.md");
  baseGithubUrl.searchParams.append("title", `Missing Page at ${pathname}`);

  const githubIssueUrl = baseGithubUrl.toString();

  const ReportRedirect = () => {
    return (
      <Link
        className="bg-lightgray text-xl text-black p-1 rounded-md my-auto font-normal"
        href={githubIssueUrl}
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
