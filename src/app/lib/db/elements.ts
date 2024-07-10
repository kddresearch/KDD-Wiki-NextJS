import { query } from "../db";
import Directory from "../models/directory";
import rPage from "../models/rpage";

async function fetchDirectoriesAndPages(): Promise<(Directory | rPage)[]> {
  const query_str = `
    SELECT d.*, 'directory' AS type
    FROM directory d
    UNION ALL
    SELECT rp.*, 'rpage' AS type
    FROM rpage rp;
  `;

  try {
    const result = await query(query_str);
    return result.rows.map((row: any) => {
      if (row.type === 'directory') {
        return new Directory(row);
      } else {
        return new rPage(row);
      }
    });
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export default fetchDirectoriesAndPages;
