"use client";

import Link from "next/link";
import { Arrow90degRight } from "react-bootstrap-icons";
import Category from "@/models/nav-model/category";
import NavItem from "@/models/nav-model/nav_item";
import Breadcrumb from "@/components/breadcrumb";
import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";
import Editor from "@/components/editors/lexical/editor";

// Lexical

const Dev = () => (
  <div className="h-full flex flex-col">
    <h1>Dev</h1>
    <Link href="/">Go back to home</Link>
    <Breadcrumb />
    <BackDrop>
      <Card title="hello testing">
        <Editor />
      </Card>
      <Card title="hello testing">woiahdi</Card>
      <Card title="hello testing">dwa id</Card>
      <Card title="hello testing"> dwahidahi</Card>
    </BackDrop>
  </div>
);

export default Dev;
