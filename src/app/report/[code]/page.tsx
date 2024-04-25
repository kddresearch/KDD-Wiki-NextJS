"use client";

import Breadcrumb from "@/components/breadcrumb";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Report404({ params }: { params: { code: string } }) {
  const page = useSearchParams()?.get("page");

  const code_ = params.code;

  return (

    <StripeBackDrop>
      <Card title="Report Page Missing" isFlex={false}>
        <p className="my-4 inline-block">
          Would you like to report missing page at
          <span className="capitalize inline-block bg-lightgray p-1 mx-1 rounded-md max-w-48 md:max-w-xs lg:max-w-sm xl:max-w-3xl overflow-hidden truncate align-middle">
            {page}
          </span>
          ?
        </p>
        <h2>What did you expect to be here?</h2>
        <p>
          <textarea
            className="w-full min-h-24 max-h-40 h-32 border-solid border-2 border-lightgray"
            placeholder="Describe what you expected to see here"
          />
        </p>
        <button className="bg-lightgray p-1 rounded-md">Submit</button>
      </Card>
    </StripeBackDrop>
  );
}
