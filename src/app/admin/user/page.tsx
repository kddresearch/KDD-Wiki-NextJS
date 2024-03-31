import Card from "@/components/page/card";
import AdminLayout from "../layout";

import { fetchAll } from "@/app/lib/db/kdd_user"
import KddUser from "@/app/lib/models/kdd_user";

export default async function UserDashboard() {

  var allUsers = await fetchAll();

  // sort alphabetically

  allUsers.sort((a, b) => {
    if (a.username < b.username) {
      return -1;
    }
    if (a.username > b.username) {
      return 1;
    }
    return 0;
  });

  // console.log(allUsers);

  for (const kdd_user of allUsers) {
    if (kdd_user.is_kdd_only) {
      console.log(kdd_user.username + " is kdd only");
    }
  }

  return (
    <div className="w-3/4 flex flex-col">
      <Card className="" title="All Users">    
        <div>Users, a lot and a lot of users </div>
        {allUsers.map((user) => {
          return (
            <div key={user.username} className="flex flex-row">
              <div>{user.username}</div>
              <div>{user.admin ? 'Admin' : 'Not Admin'}</div>
              <div>{user.readonly ? 'Read Only' : 'Not Read Only' }</div>
              <div>{user.kdd_group_id ? user.kdd_group_id.toString() : 'No group'}</div>
              <div>{user.directory_group_id ? user.directory_group_id.toString() : 'No group'}</div>
              <div>{user.is_kdd_only.toString()}</div>
            </div>
          )
        })}
      </Card>
      <Card className="" title="Users">    
        <div>Users, a lot and a lot of users </div>
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