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
import { bodyParser, handleAPIError } from "@/utils/api";

export async function GET(req: NextRequest) {
    let rcategories;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        rcategories = await fetchAll();

        return NextResponse.json(rcategories);
    } catch (err) {
        console.error("Error occurred during GET Category route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function POST(req: NextRequest) {
    let rcategory;
    let existingRCategory;

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        rcategory = await bodyParser(req, rCategory);

        existingRCategory = await fetchByName(rcategory.name);
        if (existingRCategory !== null)
            throw { status: 409, message: `rCategory with name "${existingRCategory.name}" already exists` };

        rcategory = await insert(rcategory);
        return NextResponse.json(rcategory);

    } catch (err) {
        console.error("Error occurred during POST Category route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}