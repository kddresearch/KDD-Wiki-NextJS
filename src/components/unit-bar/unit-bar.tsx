import LegacyUser from "@/models/legacy-user";
import Image from "next/image";
import Link from "next/link";
import { Search } from "react-bootstrap-icons";
import { SignIn } from "../auth/signin";
import { SignOut } from "../auth/signout";
import { auth } from "@/auth";

export default async function UnitBar({
  title,
}: {
  title: string;
}) {
  const session = await auth();
  const isSignedIn = session ? true : false;
  return (
    <div className="flex items-center justify-between w-full h-14 lg:h-14 bg-white text-purple">
      <div className="container flex items-center gap-x-4">
        <Link href={"https://k-state.edu"}>
          <Image
            src="/wildcat.svg"
            alt="unit"
            width="40"
            height="32"
            className="h-8 pointer-events-none select-none"
          />
        </Link>
        <div
          id="bar"
          className="realitive border-l-[1px] border-purple border-solid h-8 w-1"
        />
        <Link className="grow text-2xl font-bold overflow-hidden line-clamp-2" href={"/"}>
          {title}
        </Link>
        <div className="flex items-center justify-end ml-2">
          {isSignedIn ? <SignOut /> : <SignIn />}
        </div>
      </div>
    </div>
  );
}
