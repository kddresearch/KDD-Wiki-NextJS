import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

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
import { AccessLevel, rKddUser } from "@/app/lib/models/rkdd_user";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  // Checking cookies for API auth
  // var session = await auth();
  // if (session?.user == undefined) {
  //   return NextResponse.json({ error: "Unauthorized", status: 401 });
  // }

  // const user = new KddUser(session?.user);

  // if (!user.admin) {
  //   return NextResponse.json({ error: "Unauthorized", status: 403 });
  // }

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
};

export async function POST(
  req: NextRequest
) {

  const body = await req.json();

  let user;

  try {
    user = new rKddUser(body);
  } catch (err) {
    console.error("Error occurred during insert:", err);
    return NextResponse.json(
      { error: "Failed to parse user" },
      { status: 500 },
    );
  }
  
  try {
    const result = await fetchByUsername(user.username);

    console.log("this is the result", result);

    if (result) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }
  } catch (err) {
    console.error("Error occurred during fetchById:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }

  console.log("this is the body", body);

  try {
    const user = new rKddUser(body);
    const result = await insert(user);

    return NextResponse.json(result);
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
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5,
}