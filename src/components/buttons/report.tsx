import Link from "next/link";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import getPublicConfig from "@/actions/config";

function IssueReportButton({
  ...props
}: {
  pathname: string;
  type: "general" | "missing" | "not-authorized" | "error";
}) {
  const [githubIssueUrl, setGithubIssueUrl] = useState("");

  useEffect(() => {

    const handleError = (error: Error) => {
      console.error(error);
      setGithubIssueUrl("/report");
    }

    const fetchPublicConfig = async () => {
      const config = await getPublicConfig();

      const baseGithubUrl = new URL(`https://github.com/${config!.github!.owner}/${config!.github!.repo}/issues/new`);

      if (props.type === "general") { // General page report
        baseGithubUrl.searchParams.append("template", "report-page.md");
        baseGithubUrl.searchParams.append("title", `Report Page at ${props.pathname}`);
      } else if (props.type === "missing") { // Missing page or content
        baseGithubUrl.searchParams.append("labels", "missing content");
        baseGithubUrl.searchParams.append("template", "report-page-missing.md");
        baseGithubUrl.searchParams.append("title", `Missing Page at ${props.pathname}`);
      } else if (props.type === "not-authorized") { // Not authorized to view page
        baseGithubUrl.searchParams.append("labels", "not authorized");
        baseGithubUrl.searchParams.append("template", "report-page-not-authorized.md");
        baseGithubUrl.searchParams.append("title", `Not Authorized at ${props.pathname}`);
      }

      setGithubIssueUrl(baseGithubUrl.toString());
      return baseGithubUrl;
    }

    fetchPublicConfig()
      .catch(handleError);
  })

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