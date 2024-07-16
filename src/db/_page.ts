import Page from "../models/_page";
import { pageTable } from "@/schema/_page";
import { db } from "../db"
import { eq, inArray, isNull, or, asc, desc } from 'drizzle-orm'


if (db === null) {
    console.error("Database is not initialized");
    throw new Error("Database is not initialized");
}

async function fetchById(id: number): Promise<Page | null> {
    try {
        const result = await db.select().from(pageTable).where(eq(pageTable.id,id))
  
        if (result.length === 0) {
            return null;
        }
  
        return new Page(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
async function fetchByName(name: string): Promise<Page | null> {
    try {
        const result = await db.select().from(pageTable).where(eq(pageTable.name,name))
        if (result.length === 0) {
            return null;
        }
  
        if (result.length > 1) {
            console.warn(`Multiple pages with name ${name} found. Returning first result.`,);
        }
  
        return new Page(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
async function fetchAll(): Promise<Page[]> {  
    try {
        const result = await db.select().from(pageTable)

        return result.map((row: any) => new Page(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchAllByCategoryIdsOrNoCategory(
    category_ids: number[],
): Promise<Page[]> {
    try {
        const result = await db!.select()
        .from(pageTable)
        .where(
            or(
                inArray(pageTable.category_id,category_ids),
                (isNull(pageTable.category_id)
            )
        ))
        .orderBy(asc(pageTable.category_id));

  
        return result.map((row: any) => new Page(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
async function fetchAllOrderById(): Promise<Page[]> {
    try {
        const result = await db!.select().from(pageTable).orderBy(desc(pageTable.id))

        return result.map((row: any) => new Page(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
async function insert(page: Page): Promise<Page> {
    try {
        const result= await  db!.insert(pageTable).values({
          title : page.title, 
          priority : page.priority,
          content : page.content,
          discussion :page.discussion,
          is_private : page.is_private,
          is_kdd_only : page.is_kdd_only,
          category_id : page.category_id,
          author_id : page.author_id,
          name : page.name,
          has_publication : page.has_publication,
          last_updated : page.last_updated, 
          is_home : page.is_home,
          is_template : page.is_template
        })
        .returning()
    
        return new Page(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
async function update(page: Page): Promise<Page> {
    try {
        const result = await db!.update(pageTable)
        .set({
            title: page.title,
            priority : page.priority,
            content : page.content,
            discussion : page.discussion,
            is_private : page.is_private,
            is_kdd_only : page.is_kdd_only,
            category_id : page.category_id,
            author_id : page.author_id,
            name : page.name,
            has_publication : page.has_publication,
            last_updated : page.last_updated,
            is_home : page.is_home,
            is_template : page.is_template,
        })
        .where(eq(pageTable.id,page.id))
  
        return new Page(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
async function remove(page: Page): Promise<boolean> {
    try {
        await db!.delete(pageTable).where(eq(pageTable.id,page.id))
        return true;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
export {
    fetchAll,
    fetchAllByCategoryIdsOrNoCategory,
    fetchById,
    fetchByName,
    fetchAllOrderById,
    insert,
    update,
    remove,
};
  