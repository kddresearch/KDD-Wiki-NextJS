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

  const newItem = {
    href: "/",
    label: "Home",
  };
  items.unshift(newItem);

  console.log("items", items);

  return (
    <Breadcrumb className="bg-white text-purple h-14 font-light">
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
          items.slice(1, items.length).map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={item.href!} className="flex gap-1">
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))
        )}

        {items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
          <>
            {item.href ? (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                    asChild
                    className="max-w-20 truncate md:max-w-none"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator key={`${index}-sep`}/>
              </>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ResponsiveBreadcrumb;
