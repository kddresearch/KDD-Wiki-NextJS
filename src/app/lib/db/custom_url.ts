"use server";

import { query } from "../db";
import CustomUrl from "../models/custom_url";
import { customUrlTable } from "../models/custom_url";
import {eq,inArray,isNull,or,asc,desc} from 'drizzle-orm'
import {db} from '../db'


async function fetchByURL(url: string): Promise<CustomUrl | null> {
 

  try {
  
    const result = await db!.select().from(customUrlTable).where(eq(customUrlTable.url,url))

    if (result.length === 0) {
      // throw new Error(`Custom URL with url ${url} not found`);
      return null;
    }

    return new CustomUrl(result[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

// Get all custom urls
async function fetchAll(): Promise<CustomUrl[]> {
 

  try {
    
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

 

  try {
    

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


  try {
    
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
 

  try {

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
