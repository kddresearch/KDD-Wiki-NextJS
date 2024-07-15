import CustomUrl from "@/models/custom_url";
import { customUrlTable } from "@/schema/custom_url";
import { eq, inArray, isNull, or, asc, desc } from 'drizzle-orm'
import { db } from '@/db'

async function fetchByURL(url: string): Promise<CustomUrl | null> {
    try {
        const result = await db!.select().from(customUrlTable).where(eq(customUrlTable.url,url))

        if (result.length === 0) {
            return null;
        }

        return new CustomUrl(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchAll(): Promise<CustomUrl[]> {
    try {
        const result = await db!.select().from(customUrlTable)

        return result.map((row: any) => new CustomUrl(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(
    customUrl: CustomUrl,
): Promise<CustomUrl> {
    try {
        const result = await db!.insert(customUrlTable).values({
            url: customUrl.url,
            action: customUrl.action,
            target: <string>customUrl.target,
            author_id : customUrl.author_id,
        })
        .returning()

        return new CustomUrl(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function update(customUrl: CustomUrl): Promise<CustomUrl> {
    try {
        const result = await db!.update(customUrlTable).
        set({
            url : customUrl.url,
            action : customUrl.action,
            target : <string>customUrl.target,
            author_id:customUrl.author_id,
            date_modified : new Date().toISOString(),
        })
        .where(eq(customUrlTable.id,<number>customUrl.id))
        .returning()

        return new CustomUrl(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function remove(customUrl: CustomUrl): Promise<boolean> {
    try {
        await db!.delete(customUrlTable).where(eq(customUrlTable.id, <number>customUrl.id));

        return true;      
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export { fetchByURL, fetchAll, insert, update, remove };
