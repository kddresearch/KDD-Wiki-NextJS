import { query } from "../db";
import rCategoryMember from "../models/rcategory_member";

async function fetchAll(): Promise<rCategoryMember[]> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM category_member
      `;

    try {
        // Execute the query
        const result = await query(query_str);

        return result.rows.map((row: any) => new rCategoryMember(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByCategoryId(category_id: number): Promise<rCategoryMember[]> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM category_member
          WHERE category_id = $1
      `;

    try {
        // Execute the query
        const result = await query(query_str, [category_id]);

        return result.rows.map((row: any) => new rCategoryMember(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUserId(member_id: number): Promise<rCategoryMember[]> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM category_member
          WHERE member_id = $1
      `;

    try {
        // Execute the query
        const result = await query(query_str, [member_id]);

        return result.rows.map((row: any) => new rCategoryMember(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByCategoryandUser(category_id: number, member_id: number): Promise<rCategoryMember | null> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM category_member
          WHERE category_id = $1 AND member_id = $2
      `;

    try {
        // Execute the query
        const result = await query(query_str, [category_id, member_id]);

        if (result.rows.length === 0) {
            return null;
        }

        return new rCategoryMember(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(rcategory_member: rCategoryMember): Promise<rCategoryMember> {
    // Construct the query
    const query_str: string = `
          INSERT INTO category_member (category_id, user_id)
          VALUES ($1, $2)
          RETURNING *
      `;

    try {
        // Execute the query
        const result = await query(query_str, [rcategory_member.category_id, rcategory_member.member_id]);

        return new rCategoryMember(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function remove(rcategory_member: rCategoryMember): Promise<rCategoryMember> {
    // Construct the query
    const query_str: string = `
          DELETE FROM category_member
          WHERE category_id = $1 AND member_id = $2
          RETURNING *
      `;

    try {
        // Execute the query
        const result = await query(query_str, [rcategory_member.category_id, rcategory_member.member_id]);

        return new rCategoryMember(result.rows[0]);
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