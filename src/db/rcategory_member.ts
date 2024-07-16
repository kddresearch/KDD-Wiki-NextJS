import rCategoryMember from "../models/rcategory_member";
import { rCategoryMemberTable } from "@/schema/rcategory_member";
import { db } from "../db"
import { eq, inArray, isNull, or, asc, desc, and } from 'drizzle-orm'

async function fetchAll(): Promise<rCategoryMember[]> {
    try {
        const result = await db!.select().from(rCategoryMemberTable)

        return result.map((row: any) => new rCategoryMember(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByCategoryId(category_id: number): Promise<rCategoryMember[]> {
    try {
        const result = await db!.select().from(rCategoryMemberTable).where(eq(rCategoryMemberTable.category_id,category_id))

        return result.map((row: any) => new rCategoryMember(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUserId(user_id: number): Promise<rCategoryMember[]> {
    try {
        const result = await db!.select().from(rCategoryMemberTable).where(eq(rCategoryMemberTable.user_id,user_id))

        return result.map((row: any) => new rCategoryMember(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByCategoryandUser(category_id: number, user_id: number): Promise<rCategoryMember | null> {
    try {
        const result = await db!.select().from(rCategoryMemberTable).where(
            and(
                eq(rCategoryMemberTable.user_id,user_id),
                eq(rCategoryMemberTable.category_id,category_id)
            )
        );


        if (result.length === 0) {
            return null;
        }

        return new rCategoryMember(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(rcategory_member: rCategoryMember): Promise<rCategoryMember> {
    try {
        const result = await db!.insert(rCategoryMemberTable).values({
            user_id: rcategory_member.user_id,
            category_id:rcategory_member.category_id,
        })
        .returning()
        return new rCategoryMember(result[0]);

    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function remove(rcategory_member: rCategoryMember): Promise<boolean> {
    try {
        const result = await db!.delete(rCategoryMemberTable).where(
            and(
                eq(rCategoryMemberTable.user_id,rcategory_member.user_id),
                eq(rCategoryMemberTable.category_id,rcategory_member.category_id)
            )
        );

        return true;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export {
    fetchAll,
    fetchByCategoryId,
    fetchByUserId,
    fetchByCategoryandUser,
    insert,
    remove
};
