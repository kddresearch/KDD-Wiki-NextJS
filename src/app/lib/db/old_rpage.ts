import rPage from "../models/rpage";
import { query } from "../db";

async function fetchAll(): Promise<rPage[]> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM rpage
      `;

    try {
        // Execute the query
        const result = await query(query_str);

        return result.rows.map((row: any) => new rPage(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rPage | null> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM rpage
          WHERE id = $1
      `;

    try {
        // Execute the query
        const result = await query(query_str, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return new rPage(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByTitle(title: string): Promise<rPage | null> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM rpage
          WHERE title = $1
      `;

    try {
        title = title.toLowerCase();
        // Execute the query
        const result = await query(query_str, [title]);

        if (result.rows.length === 0) {
            return null;
        }

        return new rPage(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(page: rPage): Promise<rPage> {
    // Construct the query
    const query_str: string = `
          INSERT INTO rpage (title, content, author)
          VALUES ($1, $2)
          RETURNING *
      `;

    try {
        // Execute the query
        const result = await query(query_str, [page.title, page.content]);

        return new rPage(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchChildren(parentId: number): Promise<rPage[]> {
    const query_str: string = `
        WITH child_pages AS (
            SELECT p.id, p.title, p.content
            FROM rpage p
            JOIN menu_items mi ON mi.child_id = p.id
            WHERE mi.parent_id = $1 AND mi.child_type = 'page'
        )
        SELECT * FROM child_pages;
    `;

    try {
        const result = await query(query_str, [parentId]);
        return result.rows.map((row: any) => new rPage(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}