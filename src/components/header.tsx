import LegacyUser from "@/models/legacy-user";
import UnitBar from "./unit-bar/unit-bar";
import Navigation from "./unit-bar/nav-menu";
import Link from "next/link";
import { auth } from "@/auth";

import * as React from 'react';
import AccountMenu from "./user-menu";
import WikiUser from "@/models/wikiuser";

export default async function Header() {
  const session = await auth();

  let user;

  // if (session?.user) {

  //   console.log(session);

  //   user = new LegacyUser(session?.user);
  //   user = WikiUser.fromKddUser(user);
  // } else {
  user = WikiUser.guestFactory();
  // }

  user = user.toJSON();

  return (
    <header className="bg-white">
      <div className="w-full h-8 bg-lightgray text-purple">  
        <div className="flex flex-row justify-between h-full container">
          <Link className="text-sm h-4 my-auto leading-4 hover:underline" href={"https://k-state.edu"}>
            Kansas State University
          </Link>
          <div className="grow"></div>
          {session ? (
            <AccountMenu user={user}/>
          ) : (
            <Link className="text-black text-sm h-4 my-auto leading-4" href={"/"}>
              KDD Research Lab
            </Link>
          )}
        </div>
      </div>
      <UnitBar
        title="Laboratory for Knowledge Discovery in Databases"
      />
      <Navigation />
    </header>
  );
}
