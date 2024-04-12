import rCategory from "../models/rcategory";
import { query } from "../db";

async function fetchAll(): Promise<rCategory[]> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM rcategory
      `;

    try {
        // Execute the query
        const result = await query(query_str);

        return result.rows.map((row: any) => new rCategory(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<rCategory | null> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM rcategory
          WHERE id = $1
      `;

    try {
        // Execute the query
        const result = await query(query_str, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return new rCategory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

/**
 * Returns a category by its name
 * @param name Automatically lowercased
 */
async function fetchByName(name: string): Promise<rCategory | null> {
    // Construct the query
    const query_str: string = `
          SELECT * FROM rcategory
          WHERE name = $1
      `;

    try {
        name = name.toLowerCase();
        // Execute the query
        const result = await query(query_str, [name]);

        if (result.rows.length === 0) {
            return null;
        }

        return new rCategory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(category: rCategory): Promise<rCategory> {
    // Construct the query
    const query_str: string = `
          INSERT INTO rcategory (role, name, description, date_created, date_modified)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          RETURNING *
      `;

    const values: any[] = [
        category.role,
        category.name,
        category.description,
    ];

    try {
        // Execute the query
        const result = await query(query_str, values);

        return new rCategory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function update(category: rCategory): Promise<rCategory> {
    // Construct the query
    const query_str: string = `
          UPDATE rcategory
          SET role = $1, name = $2, description = $3, date_modified = NOW()
          WHERE id = $5
          RETURNING *
      `;

    const values: any[] = [
        category.role,
        category.name,
        category.description,
        category.id,
    ];

    try {
        // Execute the query
        const result = await query(query_str, values);

        return new rCategory(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function remove(category: rCategory): Promise<void> {
    // Construct the query
    const query_str: string = `
          DELETE FROM rcategory
          WHERE id = $1
      `;

    try {
        // Execute the query
        await query(query_str, [category.id]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export {
    fetchAll,
    fetchById,
    fetchByName,
    insert,
    update,
    remove,
};