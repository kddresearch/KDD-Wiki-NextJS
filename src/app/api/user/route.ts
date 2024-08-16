import { NextRequest, NextResponse } from "next/server";
import {
  fetchAll,
  fetchById,
  fetchByUsername,
  insert,
  update,
  remove,
} from "@/db/wiki_user";
import { checkAuthAPI } from "@/auth";
import LegacyUser from "@/models/legacy-user";
import { AccessLevel } from "@/models/wikiuser";
import WikiUser from "@/models/wikiuser";
import { bodyParser, handleAPIError } from "@/utils/api";


export async function GET(
    req: NextRequest
) {
    let users;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

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
    let user;
    let existingUser;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

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

