import { query } from "../db";
import rPage from "../models/rpage";

async function insertPage(page: rPage, parentId: number | null, parentType: string | null): Promise<void> {
    const query_str = `
      INSERT INTO rpage (title, content, endpoint, page_type, created_at, modified_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id;
    `;
    try {
      const result = await query(query_str, [
        page.title,
        page.content,
        page.endpoint,
        page.page_type
      ]);
      page.id = result.rows[0].id;
  
      if (parentId && parentType) {
        await query(
          `INSERT INTO menu_item (parent_id, child_id, parent_type, child_type) VALUES ($1, $2, $3, 'rpage')`,
          [parentId, page.id, parentType]
        );
      }
  
      console.log("Page inserted successfully:", page.id);
    } catch (err) {
      console.error("Error occurred during page insertion:", err);
      throw err;
    }
  }

  async function updatePage(id: number, page: Partial<rPage>, parentId?: number, parentType?: string): Promise<void> {
    const setClauses: string[] = [];
    const values: any[] = [id];
    let valueIndex = 2;

    console.log(page);

    for (const [key, value] of Object.entries(page)) {
        if (value !== undefined) {
            setClauses.push(`${key} = $${valueIndex}`);
            values.push(value);
            valueIndex++;
        }
    }

    if (setClauses.length === 0) {
        throw new Error("No fields to update");
    }

    const query_str = `
        UPDATE rpage
        SET ${setClauses.join(', ')}
        WHERE id = $1;
    `;

    const client = await query.connect();

    try {
        await client.query('BEGIN');

        await client.query(query_str, values);
        console.log("Page updated successfully");

        if (parentId && parentType) {
            // Delete the existing parent relationship
            await client.query(
                `DELETE FROM menu_item WHERE child_id = $1 AND child_type = 'rpage'`,
                [id]
            );

            // Insert the new parent relationship
            await client.query(
                `INSERT INTO menu_item (parent_id, child_id, parent_type, child_type) VALUES ($1, $2, $3, 'rpage')`,
                [parentId, id, parentType]
            );
            console.log("Parent relationship updated successfully");
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error occurred during page update:", err);
        throw err;
    } finally {
        client.release();
    }
}


async function deletePage(id: number): Promise<void> {
    const query_str = `
        DELETE FROM rpage
        WHERE id = $1;
    `;

    try {
        await query(query_str, [id]);
        console.log("Page deleted successfully");
    } catch (err) {
        console.error("Error occurred during page deletion:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rPage | null> {
    const query_str = `
        SELECT * FROM rpage
        WHERE id = $1;
    `;

    try {
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
    const query_str = `
        SELECT * FROM rpage
        WHERE title = $1;
    `;

    try {
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

async function fetchAll(): Promise<rPage[]> {
    const query_str = `
        SELECT * FROM rpage;
    `;

    const result = await query(query_str, []);

    const pages = await Promise.all(result.rows.map(async (row: any) => {
        const { type, ...pageData } = row; // Exclude type property
        const page = new rPage(pageData);
        return page;
        }));
    return pages
}

async function fetchChildren(parentId: number, parentType: string): Promise<rPage[]> {
    const query_str = `
      SELECT rp.*
      FROM rpage rp
      JOIN menu_item mi ON mi.child_id = rp.id
      WHERE mi.parent_id = $1 AND mi.child_type = 'rpage' AND mi.parent_type = $2;
    `;

    try {
        const result = await query(query_str, [parentId, parentType]);
        return result.rows.map((row: any) => new rPage(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export { insertPage, updatePage, deletePage, fetchAll, fetchById, fetchByTitle, fetchChildren };
