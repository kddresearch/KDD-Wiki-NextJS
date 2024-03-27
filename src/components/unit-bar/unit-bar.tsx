import KddUser from "@/models/kdd_user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";
import { SignIn } from "../auth/signin";

export default function UnitBar({ title, kdduser }: { title: string, kdduser: any }) {

  const user = kdduser;

  return (
    <div className="flex items-center justify-between w-full h-16 lg:h-14 bg-white text-purple">
      <div className="container flex items-center">
        <Image src="/wildcat.svg" alt="unit" width="40" height="32" className="mr-4 h-8" />
        <div id="bar" className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1"></div>
        <Link className="grow" href={"/"}>
          <p className="text-2xl font-bold overflow-hidden line-clamp-2" title={title}>
            {title}
          </p>
        </Link>
        {/* Signin */}
        <div className="flex items-center justify-end ml-2">
          {user.username !== "Guest" ? (
            // sign out
            <Link href={"/signout"} className="h-8 px-4 border-purple border-solid border-2 rounded-full min-w-max">
              Sign out
            </Link>
            // notification
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </div>
  );
}