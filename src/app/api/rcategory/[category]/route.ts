import { NextRequest, NextResponse } from "next/server";
import {
  fetchAll,
  fetchById,
  fetchByName,
  insert,
  update,
  remove,
} from "@/app/lib/db/rcategory";
import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/wikiuser";
import rCategory from "@/app/lib/models/rcategory";
import * as utils from "@/app/lib/utils/rcategory";
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";

export async function GET(
    req: NextRequest,
    { params }: { params: { category: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategory;

    try {
        rcategory = await utils.fetchrCategory(params.category)

        if (rcategory === null)
            throw { status: 404, message: "rCategory not found" };

        return NextResponse.json(rcategory);
    } catch (err) {
        console.error("Error occurred during GET Category route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { category: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategory;

    try {
        rcategory = await utils.fetchrCategory(params.category)

        if (rcategory === null)
            throw { status: 404, message: "rCategory not found" };

        rcategory.update(await bodyParser(req, rCategory));
        rcategory = await update(rcategory);

        return NextResponse.json(rcategory);
    } catch (err) {
        console.error("Error occurred during PUT Category route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}