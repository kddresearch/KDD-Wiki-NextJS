"use server";

import { query } from "../db";
import CustomUrl from "../models/custom_url";
import { customUrlTable } from "../models/custom_url";
import {eq,inArray,isNull,or,asc,desc} from 'drizzle-orm'
import {db} from '../db'


// Get custom url by url
async function fetchByURL(url: string): Promise<CustomUrl | null> {
  // Construct the query
  // const query_st: string = `
  //       SELECT * FROM custom_url
  //       WHERE url = $1;
  //   `;

  try {
    // Execute the query
    // const result = await query(query_st, [url]);
    const result = await db!.select().from(customUrlTable).where(eq(customUrlTable.url,url))

    if (result.length === 0) {
      // throw new Error(`Custom URL with url ${url} not found`);
      return null;
    }

    // Create a new CustomUrl object with the first row of the result
    return new CustomUrl(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

// Get all custom urls
async function fetchAll(): Promise<CustomUrl[]> {
  // Construct the query
  // const query_st: string = `
  //       SELECT * FROM custom_url;
  //   `;

  try {
    // Execute the query
    //const result = await query(query_st);
    const result = await db!.select().from(customUrlTable)

    // Create a new CustomUrl object for each row of the result
    return result.map((row: any) => new CustomUrl(row));
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

// Create a new custom url
async function insert(
  customUrl: CustomUrl | string,
): Promise<CustomUrl | string> {
  // if customUrl is a string, create a new CustomUrl object
  let isFromClient;
  if (typeof customUrl === "string") {
    customUrl = new CustomUrl(JSON.parse(customUrl));
    isFromClient = true;
  }

  console.log("Inserting custom URL:", customUrl);

  // Construct the query
  // const query_st: string = `
  //       INSERT INTO custom_url (url, action, target, date_created, date_modified, author_id)
  //       VALUES ($1, $2, $3, NOW(), NOW(), $4)
  //       RETURNING *;
  //   `;

  try {
    // Execute the query
    // const result = await query(query_st, [
    //   customUrl.url,
    //   customUrl.action,
    //   customUrl.target,
    //   customUrl.author_id,
    // ]);

    const result = await db!.insert(customUrlTable).values({
      url: customUrl.url,
      action: customUrl.action,
      //string | number
      target: <string>customUrl.target,
      author_id : customUrl.author_id,
    })
    .returning()

    if (isFromClient) {
      return JSON.stringify(new CustomUrl(result[0]));
    }

    // Create a new CustomUrl object with the first row of the result
    return new CustomUrl(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

// Update a custom url
async function update(customUrl: CustomUrl): Promise<CustomUrl> {
  // Construct the query
  // const query_st: string = `
  //       UPDATE custom_url
  //       SET url = $2, action = $3, target = $4, date_modified = NOW(), author_id = $5
  //       WHERE id = $1
  //       RETURNING *;
  //   `;

  try {
    // // Execute the query
    // const result = await query(query_st, [
    //   customUrl.id,
    //   customUrl.url,
    //   customUrl.action,
    //   customUrl.target,
    //   customUrl.author_id,
    // ]);

    const result = await db!.update(customUrlTable).
    set({
      url : customUrl.url,
      action : customUrl.action,
      target : <string>customUrl.target,
      author_id:customUrl.author_id,
     date_modified : <string><unknown>new Date(),
     //timestamp vs date

    })
    .where(eq(customUrlTable.id,<number>customUrl.id))
    .returning()

    // Create a new CustomUrl object with the first row of the result
    return new CustomUrl(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

// Delete a custom url
async function remove(customUrl: CustomUrl): Promise<boolean> {
  // Construct the query
  // const query_st: string = `
  //       DELETE FROM custom_url
  //       WHERE id = $1;
  //   `;

  try {
    // Execute the query
   // await query(query_st, [customUrl.id]);
    // await db!.delete(customUrlTable).where(eq(customUrlTable.id,customUrl.id))

    await db!.delete(customUrlTable).where(eq(customUrlTable.id, <number>customUrl.id))

    return true;
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function test_Server_Shit(value: any) {
  console.log("Running on the server!");

  console.log(value);

  return "this is coming from the server";
}

export { fetchByURL, fetchAll, insert, update, remove, test_Server_Shit };
