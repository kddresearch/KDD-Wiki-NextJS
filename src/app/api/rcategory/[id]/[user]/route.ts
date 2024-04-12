import { NextRequest, NextResponse } from "next/server";
// import {
//   fetchAll,
//   fetchById,
//   fetchByName,
//   insert,
//   update,
//   remove,
// } from "@/app/lib/db/rcategory";
import * as rCategorydb from "@/app/lib/db/rcategory";
import * as wikiUserdb from "@/app/lib/db/wiki_user";
import * as rCategoryMemberdb from "@/app/lib/db/rcategory_member";
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
            rcategory = await rCategorydb.fetchByName(params.id);

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
            rcategory = await rCategorydb.fetchById(categoryid);

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

            if (params.user === "self") {
                user = await wikiUserdb.fetchByUsername(authUser.username);

                if (user === null) {
                    return NextResponse.json(
                        { error: "User not found" },
                        { status: 404 },
                    );
                }
            } else if (params.user === "members") {
                try {
                    const rcategoryMembers = await rCategoryMemberdb.fetchByCategoryId(rcategory.id);

                    if (rcategoryMembers === null) {
                        return NextResponse.json(
                            { error: "No users found in rCategory" },
                            { status: 404 },
                        );
                    }

                    return NextResponse.json(rcategoryMembers);
                } catch (err) {
                    console.error("Error occurred during fetchByCategory:", err);
                    return NextResponse.json(
                        { error: "Failed to fetch rCategoryMembers" },
                        { status: 500 },
                    );
                }
            } else {
                user = await wikiUserdb.fetchByUsername(params.user);

                if (user === null) {
                    return NextResponse.json(
                        { error: "User not found" },
                        { status: 404 },
                    );
                }
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
            user = await wikiUserdb.fetchById(userid);

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
        const rcategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, user.id);

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

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategoryMember;

    const categoryid = parseInt(params.id);
    const userid = parseInt(params.user);

    let rcategory;

    if (isNaN(categoryid)) {
        try {
            rcategory = await rCategorydb.fetchByName(params.id);

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
            rcategory = await rCategorydb.fetchById(categoryid);

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
            if (params.user === "self") {
                rcategoryMember = new rCategoryMember({
                    user_id: authUser.id,
                    category_id: rcategory.id
                });
            } else {
                const user = await wikiUserdb.fetchByUsername(params.user);

                if (user === null) {
                    return NextResponse.json(
                        { error: "User not found" },
                        { status: 404 },
                    );
                }

                rcategoryMember = new rCategoryMember({
                    user_id: user.id,
                    category_id: rcategory.id
                });
            }
        } catch (err) {
            console.error("Error occurred during userLookup", err);
            return NextResponse.json(
                { error: "Failed to lookup user" },
                { status: 400 },
            );
        }
    }

    if (rcategoryMember === undefined) {
        return NextResponse.json(
            { error: "Failed to create rCategoryMember" },
            { status: 500 },
        );
    }

    // check if user is already in the category
    try {
        const existingRCategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, rcategoryMember.user_id);

        if (existingRCategoryMember !== null) {
            return NextResponse.json(
                { error: "User already in category" },
                { status: 409 },
            );
        }
    } catch (err) {
        console.error("Error occurred during fetchByCategoryandUser:", err);
        return NextResponse.json(
            { error: "Failed to fetch rCategoryMember" },
            { status: 500 },
        );
    }

    try {
        const return_rcategoryMember = await rCategoryMemberdb.insert(rcategoryMember);
        return NextResponse.json(return_rcategoryMember);
    } catch (err) {
        console.error("Error occurred during insert:", err);
        return NextResponse.json(
            { error: "Failed to insert rcategoryMember" },
            { status: 500 },
        );
    }
}