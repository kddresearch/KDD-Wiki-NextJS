"use server";

import { NextRequest, NextResponse } from "next/server";
import { checkAuthAPI } from "@/auth";
import {
    fetchAll,
    fetchById,
    fetchByUsername,
    insert,
    update,
    remove,
} from "@/app/lib/db/wiki_user";
import * as userUtils from "@/app/lib/utils/wiki_user";
import { AccessLevel, WikiUser } from "@/app/lib/models/user";
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const auth_user = await checkAuthAPI(AccessLevel.Admin);
    let user;

    try {
        user = await userUtils.fetchUser(params.id, auth_user);

        if (user === null)
            throw { status: 404, message: "User not found" };

        return NextResponse.json(user);
    } catch (err) {
        console.error("Error occurred during GET User route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const auth_user = await checkAuthAPI(AccessLevel.Admin);
    let user;

    try {
        user = await userUtils.fetchUser(params.id, auth_user);

        if (user === null)
            throw { status: 404, message: "User not found" };

        user.update(await bodyParser(req, WikiUser));

        await update(user);
        return NextResponse.json(user);
    } catch (err) {
        console.error("Error occurred during PATCH User route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const auth_user = await checkAuthAPI(AccessLevel.Admin);

    let user;

    try {
        if (params.id === "self")
            throw { status: 400, message: "Cannot delete self" };

        user = await userUtils.fetchUser(params.id, auth_user);

        if (user === null)
            throw { status: 404, message: "User not found" };

        await remove(user.id);
        return NextResponse.json({ message: "User deleted" });
    } catch (err) {
        console.error("Error occurred during DELETE User route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}