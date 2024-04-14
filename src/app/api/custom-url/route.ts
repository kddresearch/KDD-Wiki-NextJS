import { NextRequest, NextResponse } from "next/server";
import {
    fetchByURL,
    fetchAll,
    insert,
    update,
    remove,
} from "@/app/lib/db/custom_url";
import CustomUrl from "@/app/lib/models/custom_url";

import { checkAuthAPI } from "@/auth";
import Router from "next/navigation";
import { AccessLevel } from "@/app/lib/models/user";
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";

export async function GET (
    req: NextRequest
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    const url = req.nextUrl.searchParams.get("url");
    let custom_url;

    try {
        if (!url) 
            return NextResponse.json(await fetchAll());

        custom_url = await fetchByURL(url);

        if (custom_url === null) 
            throw { status: 404, message: "Custom URL not found" };

        return NextResponse.json(custom_url);
    } catch (err) {
        console.error("Error occurred during GET Custom URL route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function POST (
    req: NextRequest
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let custom_url;
    let existingCustomUrl

    try {
        custom_url = await bodyParser(req, CustomUrl);
        existingCustomUrl = await fetchByURL(custom_url.url);

        if (existingCustomUrl !== null)
            throw { status: 409, message: `Custom URL with URL "${existingCustomUrl.url}" already exists` };

        custom_url = await insert(custom_url);
        return NextResponse.json(custom_url);
    } catch (err) {
        console.error("Error occurred during POST Custom URL route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function DELETE (
    req: NextRequest
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    const url = req.nextUrl.searchParams.get("url");
    let custom_url;

    try {
        if (!url) 
            throw { status: 400, message: "URL not provided" };

        custom_url = await fetchByURL(url);

        if (custom_url === null) 
            throw { status: 404, message: "Custom URL not found" };

        const result = await remove(custom_url);
        return NextResponse.json({ success: result });
    } catch (err) {
        console.error("Error occurred during DELETE Custom URL route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}