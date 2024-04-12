import { NextRequest, NextResponse } from "next/server";
import * as rCategoryMemberdb from "@/app/lib/db/rcategory_member";
import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/user";
import rCategoryMember from "@/app/lib/models/rcategory_member";
import * as userUtils from "@/app/lib/utils/wiki_user";
import * as categoryUtils from "@/app/lib/utils/rcategory";

export async function GET(
    req: NextRequest,
    { params }: { params: { category: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);

    let rcategory;
    let user;

    try {
        rcategory = await categoryUtils.fetchrCategory(params.category)
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

    // if user is "members" return all members of the category
    if (params.user === "members") {
        try {
            const rCategoryMembers = await rCategoryMemberdb.fetchByCategoryId(rcategory.id);
            return NextResponse.json(rCategoryMembers);
        } catch (err) {
            console.error("Error occurred during fetchByCategoryId:", err);
            return NextResponse.json(
                { error: "Failed to fetch rCategoryMember" },
                { status: 500 },
            );
        }
    }

    try {
        user = await userUtils.fetchUser(params.user, authUser);
    } catch (err) {
        console.error("Error occurred during fetchUser:", err);
        return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
        );
    }

    if (user === null) {
        return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
        );
    }

    let rcategoryMember;

    try {
        rcategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, user.id);
    } catch (err) {
        console.error("Error occurred during fetchRCategoryMember:", err);
        return NextResponse.json(
            { error: "Failed to fetch rCategoryMember" },
            { status: 500 },
        );
    }

    if (rcategoryMember === null) {
        return NextResponse.json(
            { error: "User not found in rCategory" },
            { status: 404 },
        );
    }

    return NextResponse.json(rcategoryMember);
}

export async function POST(
    req: NextRequest,
    { params }: { params: { category: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategoryMember;
    let rcategory;
    let user;

    try {
        rcategory = await categoryUtils.fetchrCategory(params.category)
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

    try {
        user = await userUtils.fetchUser(params.user, authUser);
    } catch (err) {
        console.error("Error occurred during fetchUser:", err);
        return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
        );
    }

    if (user === null) {
        return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
        );
    }

    try {
        rcategoryMember = new rCategoryMember({
            category_id: rcategory.id,
            user_id: user.id,
        });
    } catch (err) {
        console.error("Error occurred during rCategoryMember creation:", err);
        return NextResponse.json(
            { error: "Failed to create rCategoryMember" },
            { status: 500 },
        );
    }

    // check if user is already in the category
    let existingRCategoryMember;
    try {
        existingRCategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, rcategoryMember.user_id);
    } catch (err) {
        console.error("Error occurred during fetchByCategoryandUser:", err);
        return NextResponse.json(
            { error: "Failed to fetch rCategoryMember" },
            { status: 500 },
        );
    }

    if (existingRCategoryMember !== null) {
        return NextResponse.json(
            { error: "User already in category" },
            { status: 409 },
        );
    }

    let return_rcategoryMember;
    try {
        return_rcategoryMember = await rCategoryMemberdb.insert(rcategoryMember);
    } catch (err) {
        console.error("Error occurred during insert:", err);
        return NextResponse.json(
            { error: "Failed to insert rcategoryMember" },
            { status: 500 },
        );
    }

    return NextResponse.json(return_rcategoryMember);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { category: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);

    let rcategory;
    let user;

    try {
        rcategory = await categoryUtils.fetchrCategory(params.category)
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

    try {
        user = await userUtils.fetchUser(params.user, authUser);
    } catch (err) {
        console.error("Error occurred during fetchUser:", err);
        return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
        );
    }

    if (user === null) {
        return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
        );
    }

    let rcategoryMember;

    try {
        rcategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, user.id);
    } catch (err) {
        console.error("Error occurred during fetchRCategoryMember:", err);
        return NextResponse.json(
            { error: "Failed to fetch rCategoryMember" },
            { status: 500 },
        );
    }
    
    if (rcategoryMember === null) {
        return NextResponse.json(
            { error: "User not found in rCategory" },
            { status: 404 },
        );
    }

    try {
        await rCategoryMemberdb.remove(rcategoryMember);
    } catch (err) {
        console.error("Error occurred during remove:", err);
        return NextResponse.json(
            { error: "Failed to remove rCategoryMember" },
            { status: 500 },
        );
    }

    return NextResponse.json({ message: `User removed from "${rcategory.name}" ` });
}