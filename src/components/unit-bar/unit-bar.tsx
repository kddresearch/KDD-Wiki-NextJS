import KddUser from "@/app/lib/models/kdd_user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { SignIn } from "../auth/signin";
import { SignOut } from "../auth/signout";
import { auth } from "@/auth";

export default async function UnitBar({
  title,
  kdduser,
}: {
  title: string;
  kdduser: any;
}) {
  const session = await auth();

  return (
    <div className="flex items-center justify-between w-full h-16 lg:h-14 bg-white text-purple">
      <div className="container flex items-center">
        <Link href={"https://k-state.edu"}>
          <Image
            src="/wildcat.svg"
            alt="unit"
            width="40"
            height="32"
            className="mr-4 h-8 pointer-events-none select-none"
          />
        </Link>
        <div
          id="bar"
          className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1"
        ></div>
        <Link className="grow" href={"/"}>
          <p
            className="text-2xl font-bold overflow-hidden line-clamp-2"
            title={title}
          >
            {title}
          </p>
        </Link>
        <div className="flex items-center justify-end ml-2">
          {session ? <SignOut /> : <SignIn />}
        </div>
      </div>
    </div>
  );
}
