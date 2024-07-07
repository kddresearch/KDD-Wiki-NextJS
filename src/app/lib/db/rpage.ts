import rPage,{rPageTable} from "../models/rpage";
import { query } from "../db";
import {db} from "../db"
import {eq,inArray,isNull,or,asc,desc,and} from 'drizzle-orm'


async function fetchAll(): Promise<rPage[]> {
    // Construct the query
    // const query_str: string = `
    //       SELECT * FROM rpage
    //   `;

    try {
        // Execute the query
        // const result = await query(query_str);
        const result = await db!.select().from(rPageTable)

        return result.map((row: any) => new rPage(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rPage | null> {
    // Construct the query
    // const query_str: string = `
    //       SELECT * FROM rpage
    //       WHERE id = $1
    //   `;

    try {
        // Execute the query
        // const result = await query(query_str, [id]);
        const result = await db!.select().from(rPageTable).where(eq(rPageTable.id,id))


        if (result.length === 0) {
            return null;
        }

        return new rPage(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByTitle(title: string): Promise<rPage | null> {
    // Construct the query
    // const query_str: string = `
    //       SELECT * FROM rpage
    //       WHERE title = $1
    //   `;

    try {
        title = title.toLowerCase();
        // Execute the query
        // const result = await query(query_str, [title]);
                const result = await db!.select().from(rPageTable).where(eq(rPageTable.title,title))


        if (result.length === 0) {
            return null;
        }

        return new rPage(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(page: rPage): Promise<rPage> {
    // Construct the query
    // const query_str: string = `
    //       INSERT INTO rpage (title, content, author)
    //       VALUES ($1, $2)
    //       RETURNING *
    //   `;

    try {
        // Execute the query
        // const result = await query(query_str, [page.title, page.content]);
               const result = await db!.insert(rPageTable).values({
                title:page.title,
                content : page.content,
                author_id : page.author_id,

               })


        return new rPage(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}