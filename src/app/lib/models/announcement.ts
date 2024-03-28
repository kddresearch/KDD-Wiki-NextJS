import joi from 'joi';
import { query } from '../db';

// Joi schema for announcement validation
const announcementSchema = joi.object({
    id: joi.number().integer().min(0),
    title: joi.string().max(50).trim().required(),
    content: joi.string().required(),
    date_created: joi.date().required(),
    date_modified: joi.date().required(),
    author_id: joi.number().integer().min(0).required(),
    is_old: joi.boolean().required()
});

class Announcement {
    id: number;
    title: string;
    content: string;
    date_created: Date;
    date_modified: Date;
    author_id: number;
    is_old: boolean;

    constructor(data: any)
    {
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = announcementSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(`Announcement validation error: ${error.message}`);
        }

        // Assign the validated values to the Announcement object
        this.id = value.id;
        this.title = value.title;
        this.content = value.content;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
        this.author_id = value.author_id;
        this.is_old = value.is_old;
    }
}

// export default Announcement;

export { Announcement };

// Database functions

/**
 * Get all announcements
 */

// Get all announcements
async function fetchAll(): Promise<Announcement[]> {

    // Construct the query    
    const query_str: string = `
        SELECT * FROM announcement
    `

    
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
        console.error('Error occurred during query execution:', err);
        throw err; 
    }
}

// Get all current announcements
async function fetchCurrent(): Promise<Announcement[]> {

    // Construct the query    
    const query_str: string = `
        SELECT * FROM announcement
        WHERE is_old = false
        OR
        is_old IS NULL
        ORDER BY date_created desc;
    `

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
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

// Get announcement by id
async function fetchById(id: number): Promise<Announcement> {

    // Construct the query    
    const query_str: string = `
        SELECT * FROM announcement
        WHERE id = $1
    `

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
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

// export functions
export {
    fetchAll,
    fetchCurrent,
    fetchById
}