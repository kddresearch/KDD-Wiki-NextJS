import WikiUser from "../models/wikiuser";
import { wikiUserTable } from "@/schema/wiki_user";
import { db } from "../db"
import { eq, inArray, isNull, or, asc, desc, and } from 'drizzle-orm'

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

async function fetchByUsername(username: String): Promise<WikiUser | null> {


  try {
    
    const result = await db!.select().from(wikiUserTable).where(eq(wikiUserTable.username,<string>username))

    if (result.length === 0) {
      return null;
    }

    if (result.length > 1) {
      console.warn("Multiple users found with the same username");
    }

    return new WikiUser(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function insert(user: WikiUser): Promise<WikiUser> {
  
  const values: any[] = [
    user.username,
    user.access_level,
    JSON.stringify(user.settings),
    user.first_name,
    user.last_name,
    user.bio,
    user.email,
    user.profile_picture,
    user.phone_number,
    JSON.stringify(user.social_media),
    JSON.stringify(user.admin_teams)
  ];

  try {
    
    const result = await db!.insert(wikiUserTable).values({
      username : <string>user.username,
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
      last_login :<string><unknown>Date.now()
      
    })
    .returning()

    return new WikiUser(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function update(user: WikiUser): Promise<WikiUser> {
 
  const values: any[] = [
    user.username,
    user.access_level,
    user.settings,
    user.first_name,
    user.last_name,
    user.bio,
    user.email,
    user.profile_picture,
    user.phone_number,
    user.social_media,
    user.id,
  ];

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
    .returning()

    return new WikiUser(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function remove(id: number): Promise<boolean> {
 
  const values: any[] = [id];

  try {
   
    const result = await db!.delete(wikiUserTable).where(eq(wikiUserTable.id,id))
    .returning()

    return true;
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export { fetchAll, fetchById, fetchByUsername, insert, update, remove };
