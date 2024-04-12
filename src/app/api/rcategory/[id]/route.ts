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

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const user = await checkAuthAPI(AccessLevel.Admin);

    const id = parseInt(params.id);

    if (isNaN(id)) {
        try {
            const rcategory = await fetchByName(params.id);

            if (rcategory === null) {
                return NextResponse.json(
                    { error: "rCategory not found" },
                    { status: 404 },
                );
            }

            return NextResponse.json(rcategory);
        } catch (err) {
            console.error("Error occurred during fetchByName:", err);
            return NextResponse.json(
                { error: "Failed to fetch rcategory" },
                { status: 500 },
            );
        }
    } else {
        try {
            const rcategory = await fetchById(id);

            if (rcategory === null) {
                return NextResponse.json(
                    { error: "rCategory not found" },
                    { status: 404 },
                );
            }

            return NextResponse.json(rcategory);
        } catch (err) {
            console.error("Error occurred during fetchById:", err);
            return NextResponse.json(
                { error: "Failed to fetch rcategory" },
                { status: 500 },
            );
        }
    }
}