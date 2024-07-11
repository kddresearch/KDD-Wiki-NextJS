import { query } from "../db";
import WikiUser from "../models/wikiuser";
import { wikiUserTable } from "../models/wikiuser";
import {db} from "../db"
import {eq,inArray,isNull,or,asc,desc,and} from 'drizzle-orm'

async function fetchAll(): Promise<WikiUser[]> {
  // Construct the query
  const query_str: string = `
    //     SELECT * FROM wiki_user
    // `;

  try {
    // Execute the query
    // const result = await query(query_str);
    const result = await db!.select().from(wikiUserTable)

    return result.map((row: any) => new WikiUser(row));
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function fetchById(id: number): Promise<WikiUser | null> {
  // Construct the query
  // const query_str: string = `
  //       SELECT * FROM wiki_user
  //       WHERE id = $1
  //   `;

  try {
    // Execute the query
    // const result = await query(query_str, [id]);
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
  // Construct the query
  // const query_str: string = `
  //       SELECT * FROM wiki_user
  //       WHERE username = $1
  //   `;

  try {
    // Execute the query
    // const result = await query(query_str, [username]);
    // const result = await db!.select().from(wikiUserTable).where(eq(wikiUserTable.username,username))
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
  // Construct the query
  // const query_str: string = `
  //       INSERT INTO wiki_user (username, access_level, settings, first_name, last_name, bio, email, profile_picture, phone_number, social_media, admin_teams, date_created, date_modified, last_login)
  //       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW())
  //       RETURNING *
  //   `;
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
    // Execute the query
    // const result = await query(query_str, values);
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
  // Construct the query
  // const query_str: string = `
  //       UPDATE wiki_user
  //       SET username = $1, access_level = $2, settings = $3, first_name = $4, last_name = $5, bio = $6, email = $7, profile_picture = $8, phone_number = $9, social_media = $10, date_modified = NOW()
  //       WHERE id = $11
  //       RETURNING *
  //   `;
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
    // Execute the query
    // const result = await query(query_str, values);
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
  // Construct the query
  // const query_str: string = `
  //       DELETE FROM wiki_user
  //       WHERE id = $1
  //       RETURNING *
  //   `;
  const values: any[] = [id];

  try {
    // Execute the query
    // const result = await query(query_str, values);
    const result = await db!.delete(wikiUserTable).where(eq(wikiUserTable.id,id))
    .returning()

    return true;
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export { fetchAll, fetchById, fetchByUsername, insert, update, remove };
