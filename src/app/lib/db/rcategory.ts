import rCategory,{rCategoryTable} from "../models/rcategory";
import { query } from "../db";
import {db} from "../db"
import {eq,inArray,isNull,or,asc,desc,and} from 'drizzle-orm'

async function fetchAll(): Promise<rCategory[]> {
    // Construct the query
    // const query_str: string = `
    //       SELECT * FROM rcategory
    //   `;

    try {
        // Execute the query
        // const result = await query(query_str);
        const result = await db!.select().from(rCategoryTable)

        return result.map((row: any) => new rCategory(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rCategory | null> {
    // Construct the query
    // const query_str: string = `
    //       SELECT * FROM rcategory
    //       WHERE id = $1
    //   `;

    try {
        // Execute the query
        // const result = await query(query_str, [id]);
        const result = await db!.select().from(rCategoryTable).where(eq(rCategoryTable.id,id))

        if (result.length === 0) {
            return null;
        }

        return new rCategory(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

/**
 * Returns a category by its name
 * @param name Automatically lowercased
 */
async function fetchByName(name: string): Promise<rCategory | null> {
    // Construct the query
    // const query_str: string = `
    //       SELECT * FROM rcategory
    //       WHERE name = $1
    //   `;

    try {
        name = name.toLowerCase();
        // Execute the query
        // const result = await query(query_str, [name]);
        const result = await db!.select().from(rCategoryTable).where(eq(rCategoryTable.name,name))


        if (result.length === 0) {
            return null;
        }

        return new rCategory(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(category: rCategory): Promise<rCategory> {
    // Construct the query
    // const query_str: string = `
    //       INSERT INTO rcategory (role, name, description, date_created, date_modified)
    //       VALUES ($1, $2, $3, NOW(), NOW())
    //       RETURNING *
    //   `;

    const values: any[] = [
        category.role,
        category.name,
        category.description,
    ];

    try {
        // Execute the query
       // const result = await query(query_str, values);
       const result = await db!.insert(rCategoryTable).values({
    
        role:<string>category.role,
        name :<string> category.name,
        description : category.description,
        date_created : <string><unknown>category.date_created,
        date_modified : <string><unknown>category.date_modified,

       })

        return new rCategory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function update(category: rCategory): Promise<rCategory> {
    // Construct the query
    // const query_str: string = `
    //       UPDATE rcategory
    //       SET role = $1, name = $2, description = $3, date_modified = NOW()
    //       WHERE id = $4
    //       RETURNING *
    //   `;

    const values: any[] = [
        category.role,
        category.name,
        category.description,
        category.id,
    ];

    try {
        // Execute the query
        // const result = await query(query_str, values);

        const result = await db!.update(rCategoryTable).set({
            role :category.role,
            name : category.name,
            description : category.description,
            date_modified : <string><unknown>Date.now()

        })
        .where(eq(rCategoryTable.id,category.id))
        .returning()

        return new rCategory(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function remove(category: rCategory): Promise<void> {
    // Construct the query
    // const query_str: string = `
    //       DELETE FROM rcategory
    //       WHERE id = $1
    //   `;

    try {
        // Execute the query
       // await query(query_str, [category.id]);
       await db!.delete(rCategoryTable).where(eq(rCategoryTable.id,category.id))
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export {
    fetchAll,
    fetchById,
    fetchByName,
    insert,
    update,
    remove,
};