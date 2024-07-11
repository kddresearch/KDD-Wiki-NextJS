import rPage,{rPageTable} from "../models/rpage";
import { query } from "../db";
import {db} from "../db"
import {eq,inArray,isNull,or,asc,desc,and} from 'drizzle-orm'


async function fetchAll(): Promise<rPage[]> {
  
    try {
        const result = await db!.select().from(rPageTable)
        return result.map((row: any) => new rPage(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rPage | null> {

    try {

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

    try {
        title = title.toLowerCase();
        
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
  
    try {
       
        const result = await db!.insert(rPageTable).values({
        title:page.title,
        content : page.content,
        author_id : page.author_id,
        category_id : page.category_id,
        views : 0,
        access_level : page.access_level
        })
        .returning()

        return new rPage(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}