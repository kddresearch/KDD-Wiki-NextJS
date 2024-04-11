import Card from "@/components/page/card";
import AdminLayout from "../layout";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import TablePagination from '@mui/material/TablePagination';

import * as kdd_user from "@/app/lib/db/kdd_user";

import * as rkdd_user from "@/app/lib/db/rkdd_user";

import KddUser from "@/app/lib/models/kdd_user";
import Link from "next/link";
import { Button, TableFooter, TablePagination } from "@mui/material";
import User from "@/app/lib/models/user";

export default async function UserDashboard() {
  var allUsers = await kdd_user.fetchAll();

  var newAllUsers = await rkdd_user.fetchAll();

  // newAllUsers.push(rKddUser.fromKddUser(allUsers[0]));

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

  for (const kdd_user of allUsers) {
    newAllUsers.push(User.fromKddUser(kdd_user));
  }

  // // save all users
  // async function saveAllUsers() {
  //   "use server";

  //   newAllUsers.forEach(async (user) => {

  //     // if user does not exist, insert
  //     if (await rkdd_user.fetchByUsername(user.username) === null) {
  //       await rkdd_user.insert(user);
  //       return;
  //     }
  //     // if user exists, update
  //     await rkdd_user.update(user);
  //   });
  // }

  return (
    <div className="w-3/4 flex flex-col">
      <Card className="" title="Old Type Users">
        <div className="my-2" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="whitespace-nowrap">
                <TableCell>Username</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Read Only</TableCell>
                <TableCell>KDD Group ID</TableCell>
                <TableCell>Directory Group ID</TableCell>
                <TableCell>Is KDD Only</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>
                    <Link href={`/member/${user.username}`}>
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell>{user.admin ? "Admin" : "Not Admin"}</TableCell>
                  <TableCell>{user.readonly ? "True" : "False"}</TableCell>
                  <TableCell>
                    {user.kdd_group_id
                      ? user.kdd_group_id.toString()
                      : "No group"}
                  </TableCell>
                  <TableCell>
                    {user.directory_group_id
                      ? user.directory_group_id.toString()
                      : "No group"}
                  </TableCell>
                  <TableCell>{user.is_kdd_only.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              Testing lmao
              {/* <TablePagination rowsPerPageOptions={[10, 50]} /> */}
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
      <Card className="" title="New Users">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="whitespace-nowrap">
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Access Level</TableCell>
                <TableCell>Settings</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Bio </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Profile Picture</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Social Media</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Date Modified</TableCell>
                <TableCell>Last Login</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newAllUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/member/${user.username}`}
                      className="hover:underline text-purple font-bold"
                    >
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell>{user.access_level}</TableCell>
                  <TableCell>{JSON.stringify(user.settings)}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link
                      href={`/member/${user.username}/#bio`}
                      className="hover:underline text-purple font-bold"
                    >
                      {user.bio.split(" ").length} words
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.email}
                  </TableCell>
                  <TableCell>{user.profile_picture}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.phone_number}
                  </TableCell>
                  <TableCell>{JSON.stringify(user.social_media)}</TableCell>
                  <TableCell>
                    {user.date_created.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.date_modified.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.last_login.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <Button
                variant="outlined"
                className="whitespace-nowrap"
                action={undefined}
              >
                Save all
              </Button>
            </TableFooter>
          </Table>
        </TableContainer>
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
