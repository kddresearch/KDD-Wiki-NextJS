import Link from "next/link";
import { Arrow90degRight } from "react-bootstrap-icons";
import Category from "@/models/nav-model/category";
import NavItem from "@/models/nav-model/nav_item";
import Breadcrumb from "@/components/breadcrumb";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import TextEditor from "@/components/editors/lexical/editor";
import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

const LexicalEditor = dynamic(() => import('@/components/editors/lexical/editor'), { ssr: false });

const Dev = () => {

  return (
    <div className="h-full flex flex-col">
      <Breadcrumb />

      <StripeBackDrop>
        <Card title="hello testing">
          {/* <TextEditor 
            // onContentChange={() => {}}
          /> */}

          <LexicalEditor/>
        </Card>
        <Card>
          {/* <ClientOnlyTextEditor/> */}
        </Card>
        <Card title="Testing the api!">
          NO API CALL HERE NO MORE.
          <p className="prose prose-code">
            grrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
          </p>
          {/* <p className="prose prose-code">
            <pre>{apiData}</pre>
          </p> */}
        </Card>
        <Card title="hello testing">THIS IS THE NEW VERSION pushed from the azure registry</Card>
        <Card title="hello testing">dwa id</Card>
        <Card title="hello testing"> dwahidahi</Card>

      </StripeBackDrop>
    </div>
  );
};

export default Dev;
