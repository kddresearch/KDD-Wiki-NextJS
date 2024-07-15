import { NextRequest, NextResponse } from "next/server";
import { fetchAll, fetchByName, insert } from "@/db/_page";

import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/models/wikiuser";
import Page from "@/models/_page";
import { bodyParser, handleAPIError } from "@/utils/api";

export async function GET(
    req: NextRequest
) {
    let pages;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        pages = await fetchAll();
        pages.sort((a, b) => a.id - b.id);

        return NextResponse.json(pages);
    } catch (err) {
        console.error("Error occurred during GET Page route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function POST(
    req: NextRequest
) {
    let page;
    let existingPage;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        page = await bodyParser(req, Page);
        existingPage = await fetchByName(page.name);

        if (existingPage !== null)
            throw { status: 409, message: `Page with name "${existingPage.name}" already exists` };

        page = await insert(page);
        return NextResponse.json(page);
    } catch (err) {
        console.error("Error occurred during POST Page route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}