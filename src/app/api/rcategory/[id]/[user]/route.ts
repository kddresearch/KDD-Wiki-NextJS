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
import rCategoryMember from "@/app/lib/models/rcategory_member";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string, user: string } },
) {

    const authUser = await checkAuthAPI(AccessLevel.Admin);
    const categoryid = parseInt(params.id);
    const userid = parseInt(params.user);

    let rcategory;
    let user;

    if (isNaN(categoryid)) {
        try {
            rcategory = await fetchByName(params.id);

            if (rcategory === null) {
                return NextResponse.json(
                    { error: "rCategory not found" },
                    { status: 404 },
                );
            }
        } catch (err) {
            console.error("Error occurred during fetchByName:", err);
            return NextResponse.json(
                { error: "Failed to fetch rcategory" },
                { status: 500 },
            );
        }
    } else {
        try {
            rcategory = await fetchById(categoryid);

            if (rcategory === null) {
                return NextResponse.json(
                    { error: "rCategory not found" },
                    { status: 404 },
                );
            }
        } catch (err) {
            console.error("Error occurred during fetchById:", err);
            return NextResponse.json(
                { error: "Failed to fetch rcategory" },
                { status: 500 },
            );
        }
    }

    if (isNaN(userid)) {
        try {
            user = await fetchByName(params.user);

            if (user === null) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 },
                );
            }
        } catch (err) {
            console.error("Error occurred during fetchByName:", err);
            return NextResponse.json(
                { error: "Failed to fetch user" },
                { status: 500 },
            );
        }
    } else {
        try {
            user = await fetchById(userid);

            if (user === null) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 },
                );
            }
        } catch (err) {
            console.error("Error occurred during fetchById:", err);
            return NextResponse.json(
                { error: "Failed to fetch user" },
                { status: 500 },
            );
        }
    }

    try {
        const rcategoryMember = await fetchRCategoryMember(rcategory.id, user.id);

        if (rcategoryMember === null) {
            return NextResponse.json(
                { error: "User not found in rCategory" },
                { status: 404 },
            );
        }

        return NextResponse.json(rcategoryMember);
    } catch (err) {
        console.error("Error occurred during fetchRCategoryMember:", err);
        return NextResponse.json(
            { error: "Failed to fetch rCategoryMember" },
            { status: 500 },
        );
    }
}