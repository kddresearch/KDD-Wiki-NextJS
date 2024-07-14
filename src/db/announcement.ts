import { Announcement } from "@/models/announcement";

// Database functions

/**
 * Get all announcements
 */
async function fetchAll(): Promise<Announcement[]> {
    // Construct the query
    const query_str: string = `
        SELECT * FROM announcement
    `;
  
    try {
        // Execute the query
        const result = await query(query_str);
  
        // Build the array of announcements
        const announcements: Announcement[] = [];
  
        // Map the rows to Announcement objects
        result.rows.map((row: any) => {
            announcements.push(new Announcement(row));
        });

        return announcements;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchCurrent(): Promise<Announcement[]> {
    // Construct the query
    const query_str: string = `
        SELECT * FROM announcement
        WHERE is_old = false
        OR
        is_old IS NULL
        ORDER BY date_created desc;
    `;
  
    try {
        // Execute the query
        const result = await query(query_str);
    
        // Build the array of announcements
        const announcements: Announcement[] = [];
    
        result.rows.map((row: any) => {
            announcements.push(new Announcement(row));
        });
    
        return announcements;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}
  
  // Get announcement by id
  async function fetchById(id: number): Promise<Announcement> {
    // Construct the query
    const query_str: string = `
        SELECT * FROM announcement
        WHERE id = $1
    `;
  
    try {
        // Execute the query
        const result = await query(query_str, [id]);
    
        // Build the array of announcements
        const announcements: Announcement[] = [];
    
        result.rows.map((row: any) => {
            announcements.push(new Announcement(row));
        });
    
        return announcements[0];
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}


export { fetchAll, fetchCurrent, fetchById };
