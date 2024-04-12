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
} from "@/app/lib/db/wiki_user";

import { auth } from "@/auth";
import KddUser from "@/app/lib/models/kdd_user";

import { AccessLevel, WikiUser } from "@/app/lib/models/user";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);

  const auth_user = await checkAuthAPI(AccessLevel.Admin);

  // if id is not a number
  if (isNaN(id)) {
    try {
      if (params.id === "self") {
        const user = await fetchByUsername(auth_user.username);

        if (user === null) {
          var kdduser = WikiUser.newUserFactory(auth_user.username);
          return NextResponse.json(kdduser);
        }

        return NextResponse.json(user);
      }

      const user = await fetchByUsername(params.id);

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);

  const auth_user = await checkAuthAPI(AccessLevel.Admin);
  let user;

  if (isNaN(id)) {
    try{
      if (params.id === "self") {
        user = await fetchByUsername(auth_user.username);
      } else {
        user = await fetchByUsername(params.id);
      }
    } catch (err) {
      console.error("Error occurred during fetchByUsername:", err);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
      );
    }
  } else {
    try {
      user = await fetchById(id);
    } catch (err) {
      console.error("Error occurred during fetchById:", err);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
      );
    }
  }

  if (user === null) {
    return NextResponse.json(
      { error: "User not found" }, 
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    user.update(new WikiUser(body));
  } catch (err) {
    console.error("Error occurred during req.json:", err);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }

  try {
    await update(user);
    return NextResponse.json(user);
  } catch (err) {
    console.error("Error updating user", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

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