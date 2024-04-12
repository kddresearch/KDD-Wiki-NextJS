import { NextRequest, NextResponse } from "next/server";
import {
  fetchAll,
  fetchById,
  fetchByName,
  insert,
  update,
  remove,
} from "@/app/lib/db/rcategory";
import { auth, checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/user";
import rCategory from "@/app/lib/models/rcategory";
import * as utils from "@/app/lib/utils/rcategory";

export async function GET(
    req: NextRequest,
    { params }: { params: { category: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategory;

    try {
        rcategory = await utils.fetchrCategory(params.category)
    } catch (err) {
        console.error("Error occurred during fetchrCategory:", err);
        return NextResponse.json(
            { error: "Failed to fetch rCategory" },
            { status: 500 },
        );
    }

    if (rcategory === null) {
        return NextResponse.json(
            { error: "rCategory not found" },
            { status: 404 },
        );
    }

    return NextResponse.json(rcategory);
}