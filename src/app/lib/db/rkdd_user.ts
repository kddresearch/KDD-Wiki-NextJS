import { query } from "../db";
import rKddUser from "../models/rkdd_user";

async function fetchAll(): Promise<rKddUser[]> {
  // Construct the query
  const query_str: string = `
        SELECT * FROM rkdd_user
    `;

  try {
    // Execute the query
    const result = await query(query_str);

    return result.rows.map((row: any) => new rKddUser(row));
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function fetchById(id: number): Promise<rKddUser | null> {
  // Construct the query
  const query_str: string = `
        SELECT * FROM rkdd_user
        WHERE id = $1
    `;

  try {
    // Execute the query
    const result = await query(query_str, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new rKddUser(result.rows[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function fetchByUsername(username: String): Promise<rKddUser | null> {
  // Construct the query
  const query_str: string = `
        SELECT * FROM rkdd_user
        WHERE username = $1
    `;

  try {
    // Execute the query
    const result = await query(query_str, [username]);

    if (result.rows.length === 0) {
      return null;
    }

    if (result.rows.length > 1) {
      console.warn("Multiple users found with the same username");
    }

    return new rKddUser(result.rows[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function insert(user: rKddUser): Promise<rKddUser> {
  // Construct the query
  const query_str: string = `
        INSERT INTO rkdd_user (username, access_level, settings, first_name, last_name, bio, email, profile_picture, phone_number, social_media, date_created, date_modified, last_login)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), NOW())
        RETURNING *
    `;
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
  ];

  try {
    // Execute the query
    const result = await query(query_str, values);

    return new rKddUser(result.rows[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function update(user: rKddUser): Promise<rKddUser> {
  // Construct the query
  const query_str: string = `
        UPDATE rkdd_user
        SET username = $1, access_level = $2, settings = $3, first_name = $4, last_name = $5, bio = $6, email = $7, profile_picture = $8, phone_number = $9, social_media = $10, date_modified = NOW()
        WHERE id = $11
        RETURNING *
    `;
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
    const result = await query(query_str, values);

    return new rKddUser(result.rows[0]);
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function remove(id: number): Promise<boolean> {
  // Construct the query
  const query_str: string = `
        DELETE FROM rkdd_user
        WHERE id = $1
        RETURNING *
    `;
  const values: any[] = [id];

  try {
    // Execute the query
    const result = await query(query_str, values);

    return true;
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export { fetchAll, fetchById, fetchByUsername, insert, update, remove };
