"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BoxArrowUpRight,
  CaretRightFill,
  ChevronDoubleRight,
  ChevronRight,
  HouseFill,
} from "react-bootstrap-icons";
import { URL } from 'whatwg-url';
import dynamic from 'next/dynamic';
import React from 'react';
import IssueReportButton from "./buttons/report";

const Breadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname?.split("/").filter((path) => path !== "");

  return (
    <nav className="bg-white text-purple h-14 font-light">
      <ol className="flex items-center space-x-2 h-14 py-3 container">
        <li>
          <Link href="/">
            <div className="flex items-center hover:underline capitalize">
              <HouseFill className="text-black mr-2" />
              <span>KDD Wiki Home</span>
            </div>
          </Link>
        </li>
        {paths?.map((path, index) => {
          const isLast = index === paths.length - 1;
          const link = "/" + paths.slice(0, index + 1).join("/");
          return (
            <li key={index}>
              <div className="flex items-center hover:underline capitalize">
                <ChevronDoubleRight className="text-yellow mr-2" />
                <Link href={link} className="">
                  <span>{path}</span>
                </Link>
              </div>
            </li>
          );
        })}
        <li className="grow" />
        <li className="justify-end">
          {/* <Link href={getGithubIssueUrl()} className="">
            Report page
            <span className="ml-2">
              <BoxArrowUpRight className="inline" />
            </span>
          </Link> */}
          <IssueReportButton pathname={pathname} type="general" />
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
