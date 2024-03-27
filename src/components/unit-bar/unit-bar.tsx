import KddUser from "@/models/kdd_user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search } from "react-bootstrap-icons";

export default function UnitBar({ title, kdduser }: { title: string, kdduser: any }) {

  const user = kdduser;

  return (
    <div className="flex items-center justify-between w-full h-16 bg-white text-purple">
      <div className="container flex items-center">
        <Image src="/wildcat.svg" alt="unit" width="75" height="75" className="pr-4 h-8" />
        <div id="bar" className="realitive pr-8 border-l-[1px] border-purple border-solid h-8 w-1"></div>
        <Link className="grow" href={"/"}>
          <p className="text-2xl font-bold overflow-hidden line-clamp-2" title={title}>
            {title}
          </p>
        </Link>
        {/* Signin */}
        <div className="flex items-center justify-end">
          {user.username !== "Guest" ? (
            // sign out
            <button className="h-8 px-4 border-purple border-solid border-2 rounded-full min-w-max">
              Sign out
            </button>
            // notification
          ) : (
            <button className="h-8 px-4 border-purple border-solid border-2 rounded-full min-w-max">
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}