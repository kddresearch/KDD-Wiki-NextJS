"use server";

import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

import { checkAuthAPI } from "@/auth";

import {
  fetchAll,
  fetchById,
  fetchByUsername,
  insert,
  update,
  remove,
} from "@/app/lib/db/rkdd_user";

import { auth } from "@/auth";
import KddUser from "@/app/lib/models/kdd_user";

import { AccessLevel, User } from "@/app/lib/models/user";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);

  const auth_user = await checkAuthAPI(AccessLevel.Admin);

  // if id is not a number
  if (isNaN(id)) {
    try {
      if (params.id === "self") {
        return NextResponse.json(auth_user);
      }

      const user = await fetchByUsername(params.id);

      if (user === null) {

        var kdduser = User.newUserFactory(params.id);

        return NextResponse.json(kdduser);

        return NextResponse.json(
          { error: "User not found" }, 
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (err) {
      console.error("Error occurred during fetchByUsername:", err);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
      );
    }
  }

  try {
    const user = await fetchById(id);

    if (user === null) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Error occurred during fetchByUsername:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    ); 
  }
}

// export async function POST(
//   req: NextRequest,
// //  { params }: { params: { id: string } },
// ) {

//   const body = await req.json();

// //  console.log("POST: ", body);

//   try {
//     const user = new rKddUser(body);
//     const result = await insert(user);

//     return NextResponse.json(result);
//   } catch (err) {
//     console.error("Error occurred during insert:", err);
//     return NextResponse.json(
//       { error: "Failed to insert user" },
//       { status: 500 },
//     );
//   }
// }

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);

  // const auth_user = await checkAPIAuth(AccessLevel.Admin);

  if (isNaN(id)) {
    try {
      if (params.id === "self") {
        return NextResponse.json(
          { error: "Cannot delete self" }, 
          { status: 400 }
        );
      }

      const user = await fetchByUsername(params.id);

      if (user === null) {
        return NextResponse.json(
          { error: "User not found" }, 
          { status: 404 }
        );
      }

      await remove(user.id);

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Error occurred during fetchByUsername:", err);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
      );
    }
  }

  try {
    const user = await fetchById(id);

    if (user === null) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    await remove(id);

    return NextResponse.json(user);
  } catch (err) {
    console.error("Error occurred during fetchByUsername:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    ); 
  }
}