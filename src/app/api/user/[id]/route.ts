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
import * as Utils from "@/app/lib/utils/wiki_user";

import { AccessLevel, WikiUser } from "@/app/lib/models/user";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);

  const auth_user = await checkAuthAPI(AccessLevel.Admin);
  let user;

  try {
    user = await Utils.fetchUser(params.id, auth_user);
  } catch (err) {
    console.error("Error occurred during fetchUser:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }

  if (user === null) {
    return NextResponse.json(
      { error: "User not found" }, 
      { status: 404 }
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

  try {
    user = await Utils.fetchUser(params.id, auth_user);
  } catch (err) {
    console.error("Error occurred during fetchUser:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
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
  const auth_user = await checkAuthAPI(AccessLevel.Admin);
  const id = parseInt(params.id);

  if (params.id === "self") {
    return NextResponse.json(
      { error: "Cannot delete self" }, 
      { status: 400 }
    );
  }
  let user;
  
  try {
    user = await Utils.fetchUser(params.id, auth_user);
  } catch (err) {
    console.error("Error occurred during fetchUser:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }

  if (user === null) {
    return NextResponse.json(
      { error: "User not found" }, 
      { status: 404 }
    );
  }

  try {
    await remove(user.id);
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user", err);
    return NextResponse.json(
      { error: "Failed to remove user" },
      { status: 500 },
    );
  }
}