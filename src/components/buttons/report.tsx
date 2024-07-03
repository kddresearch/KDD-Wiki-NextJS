// "use client";

// import 'server-only'
import Link from "next/link";
import { BoxArrowUpRight } from "react-bootstrap-icons";

// import getConfig from "@/config";
// const config = await getConfig();

import { useEffect, useState } from "react";
import getPublicConfig from "@/actions/config";

function IssueReportButton({
  ...props
}: {
  pathname: string;
  type: "general" | "missing";
}) {
  // let config;

  // getPublicConfig().then((c) => {
  //   config = c;
  // });

  const [githubIssueUrl, setGithubIssueUrl] = useState("");

  useEffect(() => {

    const fetchConfig = async () => {
      const c = await getPublicConfig();
      const config = c;

      console.log("does this fetch?");

      const baseGithubUrl = new URL(`https://github.com/${config!.github!.owner}/${config!.github!.repo}/issues/new`);

      if (props.type === "general") { // General page report
        baseGithubUrl.searchParams.append("template", "report-page.md");
        baseGithubUrl.searchParams.append("title", `Report Page at ${props.pathname}`);
      } else if (props.type === "missing") { // Missing page or content
        baseGithubUrl.searchParams.append("labels", "missing content");
        baseGithubUrl.searchParams.append("template", "report-page-missing.md");
        baseGithubUrl.searchParams.append("title", `Missing Page at ${props.pathname}`);
      }

      setGithubIssueUrl(baseGithubUrl.toString());
      return baseGithubUrl;
    }

    const baseGithubUrl = fetchConfig()
      .catch(console.error);
  })

  // useEffect(() => {
  //   getPublicConfig().then((c) => {
  //     config = c;
  //   });
  // }, []);

  // getPublicConfig().then((c) => {
  //   config = c;
  // });



  return (
    <Link href={githubIssueUrl}>
      Report page
      <span className="ml-2">
        <BoxArrowUpRight className="inline" />
      </span>
    </Link>
  );
}

export default IssueReportButton;