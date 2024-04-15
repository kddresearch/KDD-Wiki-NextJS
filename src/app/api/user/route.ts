import { NextRequest, NextResponse } from "next/server";

import {
  fetchAll,
  fetchById,
  fetchByUsername,
  insert,
  update,
  remove,
} from "@/app/lib/db/wiki_user";

import { checkAuthAPI } from "@/auth";
import KddUser from "@/app/lib/models/kdd_user";
import { AccessLevel } from "@/app/lib/models/wikiuser";
import WikiUser from "@/app/lib/models/wikiuser";
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";


export async function GET(
    req: NextRequest
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let users;

    try {
        users = await fetchAll();

        return NextResponse.json(users);
    } catch (err) {
        console.error("Error occurred during GET User route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function POST(
    req: NextRequest
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let user;
    let existingUser;

    try {
        user = await bodyParser(req, WikiUser);

        existingUser = await fetchByUsername(user.username);
        if (existingUser !== null)
            throw { status: 409, message: `User with username "${existingUser.username}" already exists` };

        user = await insert(user);
        return NextResponse.json(user);
    } catch (err) {
        console.error("Error occurred during GET User route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export const maxDuration = 5;