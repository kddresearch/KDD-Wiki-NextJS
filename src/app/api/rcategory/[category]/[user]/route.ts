import { NextRequest, NextResponse } from "next/server";
import * as rCategoryMemberdb from "@/app/lib/db/rcategory_member";
import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/user";
import rCategoryMember from "@/app/lib/models/rcategory_member";
import * as userUtils from "@/app/lib/utils/wiki_user";
import * as categoryUtils from "@/app/lib/utils/rcategory";
import handleAPIError from "@/app/lib/utils/api";

/**
 * name of route to fetch all members in a category | Protected keyword
 */
const FETCHALL = "members";

export async function GET(
    req: NextRequest,
    { params }: { params: { category: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategory;
    let rcategoryMember;
    let user;

    try {
        rcategory = await categoryUtils.fetchrCategory(params.category)
        user = await userUtils.fetchUser(params.user, authUser);
    
        if (rcategory === null) 
            throw { status: 404, message: "rCategory not found" };
        if (user === null) 
            throw { status: 404, message: "User not found" };

        if (params.user === FETCHALL) {
            const rCategoryMembers = await rCategoryMemberdb.fetchByCategoryId(rcategory.id);
            return NextResponse.json(rCategoryMembers);
        }

        rcategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, user.id);
        return NextResponse.json(rcategoryMember);
    } catch (err) {
        console.error("Error occurred during GET CategoryMember route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { category: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let rcategoryMember;
    let rcategory;
    let user;
    let existingRCategoryMember;
    let return_rcategoryMember;

    try {
        rcategory = await categoryUtils.fetchrCategory(params.category)
        user = await userUtils.fetchUser(params.user, authUser);

        if (rcategory === null) 
            throw { status: 404, message: "rCategory not found" };
        if (user === null)
            throw { status: 404, message: "User not found" };

        rcategoryMember = new rCategoryMember({
            category_id: rcategory.id,
            user_id: user.id,
        });

        existingRCategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategoryMember.category_id, rcategoryMember.user_id);

        if (existingRCategoryMember !== null) 
            throw { status: 409, message: "User already in category" };

        return_rcategoryMember = await rCategoryMemberdb.insert(rcategoryMember);

        return NextResponse.json(return_rcategoryMember);
    } catch (err) {
        console.error("Error occurred during POST CategoryMember route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { category: string, user: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);

    let rcategory;
    let user;
    let rcategoryMember;

    try {
        rcategory = await categoryUtils.fetchrCategory(params.category)
        user = await userUtils.fetchUser(params.user, authUser);

        if (rcategory === null) 
            throw { status: 404, message: "rCategory not found" };
        if (user === null) 
            throw { status: 404, message: "User not found" };

        rcategoryMember = await rCategoryMemberdb.fetchByCategoryandUser(rcategory.id, user.id);

        if (rcategoryMember === null) 
            throw { status: 404, message: "User not found in rCategory" };

        await rCategoryMemberdb.remove(rcategoryMember);

        return NextResponse.json({ message: `User removed from "${rcategory.name}" ` });
    } catch (err) {
        console.error("Error occurred during DELETE CategoryMember route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}