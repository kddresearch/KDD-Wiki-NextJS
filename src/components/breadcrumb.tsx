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
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronsRight, House } from "lucide-react";

const ITEMS_TO_DISPLAY = 3

const ResponsiveBreadcrumb = () => {
  const pathname = usePathname();
  const paths = pathname?.split("/").filter((path) => path !== "");

  const items = paths?.map((path, index) => {
    const isLast = index === paths.length - 1;
    const link = "/" + paths.slice(0, index + 1).join("/");

    // make path uppercase
    path = path.charAt(0).toUpperCase() + path.slice(1);

    if (isLast) {
      return {
        href: null,
        label: path,
      };
    }

    return {
      href: link,
      label: path,
    };
  });

  const finalSlice = items.length > ITEMS_TO_DISPLAY ? -2 : -1;

  const newItem = {
    href: "/",
    label: "Wiki Home",
  };
  items.unshift(newItem);

  if (items.length === 1) {
    return (
      <Breadcrumb className="bg-white text-purple h-14 font-light flex">
        <BreadcrumbList className="container h-14">
          <BreadcrumbPage className="flex gap-1">
            <House className="w-5 h-5"/>
            {items[0].label}
          </BreadcrumbPage>

          <li className="flex-grow" />

          <li className="justify-end">
            <IssueReportButton pathname={pathname} type="general"/>
          </li>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="bg-white text-purple h-14 font-light flex">
      <BreadcrumbList className="container h-14">
        <BreadcrumbItem key="home">
          <BreadcrumbLink href={items[0].href!} className="flex gap-1">
            <House className="w-5 h-5"/>
            {items[0].label}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator key="home-sep"/>

        {items.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbItem key={"toggle-menu"}>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {items.slice(1, -2).map((item, index) => (
                    <DropdownMenuItem key={index}>
                      <Link href={item.href ? item.href : "#"} className="w-full">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator key="toggle-menu-sep"/>
          </>
        ) : (
          items.slice(1, items.length - 1).map((item, index) => (
            <React.Fragment key={`last-${index}`}>
              <BreadcrumbItem>
                <BreadcrumbLink href={item.href!} className="flex gap-1">
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              <BreadcrumbSeparator />
            </React.Fragment>
          ))
        )}

        {items.slice(finalSlice).map((item, index) => (
          <React.Fragment key={`last-${index}`}>
            {item.href ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="max-w-20 truncate md:max-w-none"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                    {item.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </React.Fragment>
        ))}

        <li className="flex-grow" />

        <li className="justify-end">
          <IssueReportButton pathname={pathname} type="general"/>
        </li>

      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ResponsiveBreadcrumb;
