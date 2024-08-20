import WikiUser from "../models/wikiuser";
import { wikiUserTable } from "@/schema/wiki_user";
import { db } from "../db"
import { eq } from 'drizzle-orm'

async function fetchAll(): Promise<WikiUser[]> {
    try {
        const result = await db!.select().from(wikiUserTable)

        return result.map((row: any) => new WikiUser(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<WikiUser | null> {
    try {
        const result = await db!.select().from(wikiUserTable).where(eq(wikiUserTable.id,id))

        if (result.length === 0) {
            return null;
        }

        return new WikiUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUsername(username: string): Promise<WikiUser | null> {
    try {
        const result = await db!.select().from(wikiUserTable).where(eq(wikiUserTable.username, username));

        if (result.length === 0) {
            return null;
        }

        return new WikiUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(user: WikiUser): Promise<WikiUser> {
    try {
        const result = await db!.insert(wikiUserTable).values({
            username: <string>user.username,
            access_level: user.access_level,
            settings: user.settings,
            first_name: user.first_name,
            last_name: user.last_name,
            bio: user.bio,
            email: user.email,
            profile_picture: user.profile_picture,
            phone_number: user.phone_number,
            social_media: user.social_media,
            date_modified: <string><unknown>Date.now(),
            last_login: <string><unknown>Date.now()
          
        })
        .returning();

        return new WikiUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function update(user: WikiUser): Promise<WikiUser> {
    try {
        const result = await db!.update(wikiUserTable)
        .set({
            username : user.username,
            access_level : user.access_level,
            settings : user.settings,
            first_name : user.first_name,
            last_name : user.last_name,
            bio : user.bio,
            email : user.email,
            profile_picture : user.profile_picture,
            phone_number : user.phone_number,
            social_media : user.social_media,
            date_modified : <string><unknown>Date.now(),
        }).where(eq(wikiUserTable.id,user.id))
        .returning();

        return new WikiUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function remove(id: number): Promise<boolean> {
  try {
    const result = await db!.delete(wikiUserTable).where(eq(wikiUserTable.id,id))
    .returning();

    return true;
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export { fetchAll, fetchById, fetchByUsername, insert, update, remove };
