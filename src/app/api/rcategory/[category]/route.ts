import { NextRequest, NextResponse } from "next/server";
import {
  fetchAll,
  fetchById,
  fetchByName,
  insert,
  update,
  remove,
} from "@/db/rcategory";
import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/models/wikiuser";
import rCategory from "@/models/rcategory";
import * as utils from "@/utils/rcategory";
import { bodyParser, handleAPIError } from "@/utils/api";

export async function GET(
    req: NextRequest,
    { params }: { params: { category: string } },
) {
    let rcategory;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

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
    let rcategory;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

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