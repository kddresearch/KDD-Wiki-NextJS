import KddUser from "@/app/lib/models/kdd_user";
import UnitBar from "./unit-bar/unit-bar";
import Navigation from "./unit-bar/nav-menu";
import Link from "next/link";
import { auth } from "@/auth";

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AccountMenu from "./user-menu";
import WikiUser from "@/app/lib/models/wikiuser";
// import PersonAdd from '@mui/icons-material/PersonAdd';
// import Settings from '@mui/icons-material/Settings';
// import Logout from '@mui/icons-material/Logout';

export default async function Header() {
  const session = await auth();

  let user;

  if (session?.user) {
    user = new KddUser(session?.user);
    user = WikiUser.fromKddUser(user);
  } else {
    user = WikiUser.guestFactory();
  }

  user = user.toJSON();

  return (
    <header className="bg-white">
      <div className="w-full h-8 px-4 bg-lightgray text-purple">  
        <div className="flex flex-row justify-between h-full container">
          <Link className="my-auto" href={"https://k-state.edu"}>
            <h1 className="text-xs h-4">Kansas State University</h1>
          </Link>
          <div className="grow"></div>
          {session ? (
            <AccountMenu user={user}/>
          ) : (
            <Link className="my-auto" href={"/"}>
              <h1 className="text-xs h-4">KDD Research Lab</h1>
            </Link>
          )}
        </div>
      </div>
      <UnitBar
        title="Laboratory for Knowledge Discovery in Databases"
        kdduser={WikiUser.guestFactory().toJSON()}
      />
      <Navigation />
    </header>
  );
}
