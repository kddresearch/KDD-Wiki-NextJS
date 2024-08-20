import Card from "@/components/layout/card";
import AdminLayout from "../layout";

import * as React from "react";

import * as LegacyUsers from "@/db/legacy-user";

import * as WikiUsers from "@/db/wiki_user";
import WikiUser from "@/models/wikiuser";
import Link from "next/link";

export default async function UserDashboard() {
  var allUsers = await LegacyUsers.fetchAll();
  var newAllUsers = await WikiUsers.fetchAll();

  allUsers.sort((a, b) => {
    if (a.username < b.username) {
      return -1;
    }
    if (a.username > b.username) {
      return 1;
    }
    return 0;
  });

  for (const kdd_user of allUsers) {
    newAllUsers.push(WikiUser.fromKddUser(kdd_user));
  }

  return (
    <div className="w-3/4 flex flex-col">
      <Card className="" title="Old Type Users">
        <div className="my-2" />
      </Card>
      <Card className="" title="New Users">
      </Card>
      <Card className="" title="Users">
        <div>Users, a lot and a lot of users </div>
      </Card>
      <Card className="" title="Users">
        <div>Users, a lot and a lot of users </div>
      </Card>
    </div>
  );
}
