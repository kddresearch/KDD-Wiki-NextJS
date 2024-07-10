import { query } from "../db";
import Directory from "../models/directory";
import rPage from "../models/rpage";

async function insertDirectory(directory: Directory): Promise<void> {
    const query_str = `
        INSERT INTO directory (title, created_at, modified_at)
        VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id;
    `;
    try {
        const result = await query(query_str, [directory.title]);
        directory.id = result.rows[0].id;
        console.log("Directory inserted successfully:", directory.id);
    } catch (err) {
        console.error("Error occurred during directory insertion:", err);
        throw err;
    }
}

async function updateDirectory(id: number, directory: Partial<Directory>): Promise<void> {
    const setClauses: string[] = [];
    const values: any[] = [id];
    let valueIndex = 2;

    for (const [key, value] of Object.entries(directory)) {
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
        UPDATE directory
        SET ${setClauses.join(', ')}, modified_at = CURRENT_TIMESTAMP
        WHERE id = $1;
    `;

    try {
        await query(query_str, values);
        console.log("Directory updated successfully");
    } catch (err) {
        console.error("Error occurred during directory update:", err);
        throw err;
    }
}

async function deleteDirectory(id: number): Promise<void> {
    const query_str = `
        DELETE FROM directory
        WHERE id = $1;
    `;

    try {
        await query(query_str, [id]);
        console.log("Directory deleted successfully");
    } catch (err) {
        console.error("Error occurred during directory deletion:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<Directory | null> {
    const query_str = `
        SELECT * FROM directory
        WHERE id = $1;
    `;

    try {
        const result = await query(query_str, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Directory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByTitle(title: string): Promise<Directory | null> {
    const query_str = `
        SELECT * FROM directory
        WHERE title = $1;
    `;

    try {
        const result = await query(query_str, [title]);
        if (result.rows.length === 0) {
            return null;
        }
        return new Directory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchTopLevelDirectories(): Promise<Directory[]> {
    const query_str = `
      SELECT d.*, 'directory' AS type
      FROM directory d;
    `;
    const result = await query(query_str);

    const directories = await Promise.all(result.rows.map(async (row: any) => {
      const { type, ...directoryData } = row; // Exclude type property
      const directory = new Directory(directoryData);
      directory.children = await fetchChildren(directory.id);
      return directory;
    }));
    return directories;
  }

  async function fetchAll(): Promise<Directory[]> {
    const query_str = `
      SELECT *
      FROM directory d;
    `;
    const result = await query(query_str);

    const directories = await Promise.all(result.rows.map(async (row: any) => {
      const { type, ...directoryData } = row; // Exclude type property
      const directory = new Directory(directoryData);
      return directory;
    }));
    return directories;
  }
  
  async function fetchChildren(parentId: number): Promise<(Directory | rPage)[]> {
    const query_str = `
      SELECT d.id, d.created_at, d.modified_at, d.title, NULL AS content, NULL AS page_type, 'directory' AS type
      FROM directory d
      JOIN menu_item mi ON mi.child_id = d.id
      WHERE mi.parent_id = $1 AND mi.child_type = 'directory'
      UNION ALL
      SELECT rp.id, rp.created_at, rp.modified_at, rp.title, rp.content, rp.page_type, 'rpage' AS type
      FROM rpage rp
      JOIN menu_item mi ON mi.child_id = rp.id
      WHERE mi.parent_id = $1 AND mi.child_type = 'rpage';
    `;
  
    try {
      const result = await query(query_str, [parentId]);

      return result.rows.map((row: any) => {
        const { type, ...childData } = row; // Exclude type property
        if (type === 'directory') {
          return new Directory(childData);
        } else {
          return new rPage(childData);
        }
      });
    } catch (err) {
      console.error("Error occurred during query execution:", err);
      throw err;
    }
  }


export { insertDirectory, updateDirectory, deleteDirectory, fetchById, fetchByTitle, fetchChildren, fetchTopLevelDirectories, fetchAll };
