import { NextRequest, NextResponse } from "next/server";

import {
  fetchAll,
  fetchById,
  fetchByUsername,
  insert,
  update,
  remove,
} from "@/app/lib/db/wiki_user";

import { auth, checkAuthAPI } from "@/auth";
import KddUser from "@/app/lib/models/kdd_user";
import { AccessLevel } from "@/app/lib/models/user";
import WikiUser from "@/app/lib/models/user";

export async function GET(
  req: NextRequest
) {
  const authUser = await checkAuthAPI(AccessLevel.Admin);

  try {
    const users = await fetchAll();

    return NextResponse.json(users);
  } catch (err) {
    console.error("Error occurred during fetchAll:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest
) {
  const authUser = await checkAuthAPI(AccessLevel.Admin);
  let user;

  // Try to parse the request body
  try {
    const body = await req.json();
    user = new WikiUser(body);
  } catch (err) {
    console.error("Error occurred during req.json:", err);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }

  // Check if the user already exists
  try {
    let existingUser  = await fetchByUsername(user.username);
    if (existingUser  !== null) {
      return NextResponse.json(
        { error: "User with username already exists" },
        { status: 409 },
      );
    }
  } catch (err) {
    console.error("Error occurred during fetchByUsername:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }

  // Insert the user
  try {
    const return_user = await insert(user);
    return NextResponse.json(return_user);
  } catch (err) {
    console.error("Error occurred during insert:", err);
    return NextResponse.json(
      { error: "Failed to insert user" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 5,
}