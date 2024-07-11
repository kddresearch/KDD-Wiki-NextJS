import rCategory,{rCategoryTable} from "../models/rcategory";
import { query } from "../db";
import {db} from "../db"
import {eq,inArray,isNull,or,asc,desc,and} from 'drizzle-orm'

async function fetchAll(): Promise<rCategory[]> {

    try {
        const result = await db!.select().from(rCategoryTable)
        return result.map((row: any) => new rCategory(row));

    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rCategory | null> {
     try {
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
       try {
        name = name.toLowerCase();
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

    const values: any[] = [
        category.role,
        category.name,
        category.description,
    ];

    try {
        // Execute the query
        // const result = await query(query_str, values);
        const result = await db!.insert(rCategoryTable).values({
            role: category.role,
            name: category.name,
            description: category.description,
            date_created: new Date().toISOString(), // Setting to ISO string for postgres
            date_modified: new Date().toISOString()
        })
        .returning()

        return new rCategory(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function update(category: rCategory): Promise<rCategory> {

    const values: any[] = [
        category.role,
        category.name,
        category.description,
        category.id,
    ];

    try {
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
   
    try {
        
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