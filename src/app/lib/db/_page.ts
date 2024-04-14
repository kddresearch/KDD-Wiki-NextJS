import { query } from "../db";
import Page from "../models/_page";

async function fetchById(id: number): Promise<Page | null> {
    // Construct the query
    const query_st: string = `
          SELECT * FROM page
          WHERE id = $1
      `;
  
    try {
      // Execute the query
      const result = await query(query_st, [id]);
  
      if (result.rows.length === 0) {
        return null;
      }
  
      // Create a new Page object from the first row of the result
      return new Page(result.rows[0]);
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function fetchByName(name: string): Promise<Page | null> {
    // Construct the query
    const query_st: string = `
          SELECT * FROM page
          WHERE name = $1
      `;
  
    try {
      // Execute the query
      const result = await query(query_st, [name]);
  
      if (result.rows.length === 0) {
        return null;
      }
  
      if (result.rows.length > 1) {
        console.warn(
          `Multiple pages with name ${name} found. Returning first result.`,
        );
      }
  
      // Create a new Page object from the first row of the result
      return new Page(result.rows[0]);
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function fetchsAll(): Promise<Page[]> {
    // Construct the query
    const query_st: string = `
          SELECT * FROM page
      `;
  
    try {
      // Execute the query
      const result = await query(query_st);
  
      return result.rows.map((row: any) => new Page(row));
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function fetchAllByCategoryIdsOrNoCategory(
    category_ids: number[],
  ): Promise<Page[]> {
    // Construct the query
    const query_st: string = `
          SELECT * FROM page
          WHERE category_id = ANY($1::int[])
          OR category_id IS NULL
          ORDER BY priority ASC;
      `;
  
    try {
      // Execute the query
      const result = await query(query_st, [category_ids]);
  
      return result.rows.map((row: any) => new Page(row));
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function fetchAllOrderById(): Promise<Page[]> {
    // Construct the query
    const query_st: string = `
          SELECT * FROM page 
          ORDER BY id desc
      `;
  
    try {
      // Execute the query
      const result = await query(query_st);
  
      return result.rows.map((row: any) => new Page(row));
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function insert(page: Page): Promise<Page> {
    // Construct the query
    const query_st: string = `
          INSERT INTO page (title, priority, content, discussion, is_private, is_kdd_only, date_created, date_modified, category_id, author_id, name, has_publication, last_updated, is_home, is_template)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7, $8, $9, $10, $11, $12, $13)
          RETURNING *;
      `;
  
    try {
      // Execute the query
      const result = await query(query_st, [
        page.title,
        page.priority,
        page.content,
        page.discussion,
        page.is_private,
        page.is_kdd_only,
        page.category_id,
        page.author_id,
        page.name,
        page.has_publication,
        page.last_updated,
        page.is_home,
        page.is_template,
      ]);
  
      return new Page(result.rows[0]);
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function update(page: Page): Promise<Page> {
    // Construct the query
    const query_st: string = `
          UPDATE page
          SET title = $1, priority = $2, content = $3, discussion = $4, is_private = $5, is_kdd_only = $6, date_modified = NOW(), category_id = $7, author_id = $8, name = $9, has_publication = $10, last_updated = $11, is_home = $12, is_template = $13
          WHERE id = $14
          RETURNING *;
      `;
    try {
      // Execute the query
      const result = await query(query_st, [
        page.title,
        page.priority,
        page.content,
        page.discussion,
        page.is_private,
        page.is_kdd_only,
        page.category_id,
        page.author_id,
        page.name,
        page.has_publication,
        page.last_updated,
        page.is_home,
        page.is_template,
        page.id,
      ]);
  
      return new Page(result.rows[0]);
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
  async function remove(page: Page): Promise<boolean> {
    // Construct the query
    const query_st: string = `
          DELETE FROM page
          WHERE id = $1
      `;
  
    try {
      // Execute the query
      await query(query_st, [page.id]);
      return true;
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }
  
export {
    fetchsAll as fetchAll,
    fetchAllByCategoryIdsOrNoCategory,
    fetchById,
    fetchByName,
    fetchAllOrderById,
    insert,
    update,
    remove,
};
  