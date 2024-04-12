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

export async function GET(req: NextRequest) {
    const user = await checkAuthAPI(AccessLevel.Admin);

    try {
        const rcategories = await fetchAll();

        return NextResponse.json(rcategories);
    } catch (err) {
        console.error("Error occurred during fetchAll:", err);
        return NextResponse.json(
            { error: "Failed to fetch rcategories" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    const _ = await checkAuthAPI(AccessLevel.Admin);
    let rcategory;

    // Try to parse the request body
    try {
        const body = await req.json();
        rcategory = new rCategory(body);
    } catch (err) {
        console.error("Error occurred during req.json:", err);
        return NextResponse.json(
            { error: "Failed to parse request body" },
            { status: 400 },
        );
    }

    // Check if the rcategory already exists
    try {
        let existingRCategory = await fetchByName(rcategory.name);
        if (existingRCategory !== null) {
            return NextResponse.json(
                { error: `rCategory with name "${existingRCategory.name}" already exists` },
                { status: 409 },
            );
        }
    } catch (err) {
        console.error("Error occurred during fetchByName:", err);
        return NextResponse.json(
            { error: "Failed to fetch rcategory" },
            { status: 500 },
        );
    }

    try {
        const return_rcategory = await insert(rcategory);
        return NextResponse.json(return_rcategory);
    } catch (err) {
        console.error("Error occurred during insert:", err);
        return NextResponse.json(
            { error: "Failed to insert rcategory" },
            { status: 500 },
        );
    }
}