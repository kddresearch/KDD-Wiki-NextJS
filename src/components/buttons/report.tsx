import Link from "next/link";
import { BoxArrowUpRight, Github } from "react-bootstrap-icons";
import React, { useEffect, useState } from "react";
import getPublicConfig from "@/actions/config";
import { Button } from "@/components/ui/button"

import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"

const reportButtonVariants = cva(
  "my-auto",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-8 rounded-md px-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface IssueReportButtonProps 
  extends React.HTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof reportButtonVariants> {
  pathname: string;
  type: "general" | "missing" | "not-authorized" | "error";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  // size?: "default" | "lg";
}

function IssueReportButton({
  pathname,
  type,
  size = "default",
  variant,
  ...props
}:
  IssueReportButtonProps
) {
  const [githubIssueUrl, setGithubIssueUrl] = useState("");

  useEffect(() => {

    const handleError = (error: Error) => {
      console.error(error);
      setGithubIssueUrl("/report");
    }

    const fetchPublicConfig = async () => {
      const publicConfig = await getPublicConfig();

      const baseGithubUrl = new URL(`https://github.com/${publicConfig!.Github!.Owner}/${publicConfig!.Github!.Repository}/issues/new`);

      if (type === "general") { // General page report
        baseGithubUrl.searchParams.append("template", "report-page.md");
        baseGithubUrl.searchParams.append("title", `Report Page at ${pathname}`);
      } else if (type === "missing") { // Missing page or content
        baseGithubUrl.searchParams.append("labels", "missing content");
        baseGithubUrl.searchParams.append("template", "report-page-missing.md");
        baseGithubUrl.searchParams.append("title", `Missing Page at ${pathname}`);
      } else if (type === "not-authorized") { // Not authorized to view page
        baseGithubUrl.searchParams.append("labels", "not authorized");
        baseGithubUrl.searchParams.append("template", "report-page-not-authorized.md");
        baseGithubUrl.searchParams.append("title", `Not Authorized at ${pathname}`);
      }

      setGithubIssueUrl(baseGithubUrl.toString());
      return baseGithubUrl;
    }

    fetchPublicConfig()
      .catch(handleError);
  })

  
  if (size === "lg") size="lg";

  return (
    <Button 
      variant={variant ?? "link"}
      className="my-auto"
      size={size}
      asChild
    >
      <Link 
        href={githubIssueUrl} 
        className={cn("gap-1", props.className)}
      >
        Report Page
        <Github className="inline h-4 w-4" />
      </Link>
    </Button>
  );
}

export default IssueReportButton;