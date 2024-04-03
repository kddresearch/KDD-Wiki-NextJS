import { query } from "../db";
import KddUser from "../models/kdd_user";

async function fetchAll(): Promise<KddUser[]> {
  // Construct the query
  const query_str: string = `
        SELECT * FROM kdd_user
    `;

  try {
    // Execute the query
    const result = await query(query_str);

    return result.rows.map((row: any) => new KddUser(row));
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function fetchByUsername(username: String): Promise<KddUser> {
  // Construct the query
  const query_str: string = `
        SELECT * FROM kdd_user
        WHERE username = $1
    `;

  try {
    // Execute the query
    const result = await query(query_str, [username]);

    return new KddUser(result.rows[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function insert(user: KddUser): Promise<KddUser> {
  // Construct the query
  const query_str: string = `
        INSERT INTO kdd_user (username, member, admin, readonly, date_created, date_modified, kdd_group_id, directory_group_id, is_kdd_only)
        VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6, $7)
        RETURNING *
    `;
  const values: any[] = [
    user.username,
    user.admin,
    user.readonly,
    user.kdd_group_id,
    user.directory_group_id,
    user.is_kdd_only,
  ];

  try {
    // Execute the query
    const result = await query(query_str, values);

    return new KddUser(result.rows[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export { fetchAll, fetchByUsername, insert };
