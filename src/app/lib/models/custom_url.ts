import joi from 'joi';
import { query } from '../db';

// Joi schema for custom_url validation
const customUrlSchema = joi.object({
    id: joi.number().integer().min(0).optional(),
    url: joi.string().max(50).required(),
    action: joi.string().valid('pg', 'rd').required(),
    target: joi.string().when('action', {
        is: 'pg',
        then: joi.number().integer().min(0).required(),
        otherwise: joi.string().uri().required()
    }),
    date_created: joi.date().required(),
    date_modified: joi.date().required(),
    author_id: joi.number().integer().min(0).required()
});

class CustomUrl {
    id?: number;
    url: string;
    action: 'pg' | 'rd';
    target: string | number;

    // metadata
    date_created: Date;
    date_modified: Date;
    author_id: number;

    constructor(data: any)
    {
        // Convert author_id to number
        data.author_id = Number(data.author_id);

        const { error, value } = customUrlSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(`CustomUrl validation error: ${error.message}\nCurrent Value: ${data[error.name]}`);
        }

        // Assign the validated values to the CustomUrl object
        this.id = value.id;
        this.url = value.url;
        this.action = value.action;
        this.target = value.target;

        // metadata
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
        this.author_id = value.author_id;
    }
}

export { CustomUrl };

// Get custom url by url
async function fetchByURL(url: string): Promise<CustomUrl> {

    // Construct the query
    const query_st: string = `
        SELECT * FROM custom_url
        WHERE url = $1;
    `;

    try {
        // Execute the query
        const result = await query(query_st, [url]);

        if (result.rows.length === 0) {
            throw new Error(`Custom URL with url ${url} not found`);
        }

        // Create a new CustomUrl object with the first row of the result
        return new CustomUrl(result.rows[0]);

    } catch (err) {
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

// Get all custom urls
async function fetchAll(): Promise<CustomUrl[]> {

    // Construct the query
    const query_st: string = `
        SELECT * FROM custom_url;
    `;

    try {
        // Execute the query
        const result = await query(query_st);

        // Create a new CustomUrl object for each row of the result
        return result.rows.map((row: any) => new CustomUrl(row));

    } catch (err) {
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

// Create a new custom url
async function insert(customUrl: CustomUrl): Promise<CustomUrl> {

    // Construct the query
    const query_st: string = `
        INSERT INTO custom_url (url, action, target, date_created, date_modified, author_id)
        VALUES ($1, $2, $3, NOW(), NOW(), $4)
        RETURNING *;
    `;

    try {
        // Execute the query
        const result = await query(query_st, [customUrl.url, customUrl.action, customUrl.target, customUrl.author_id]);

        // Create a new CustomUrl object with the first row of the result
        return new CustomUrl(result.rows[0]);

    } catch (err) {
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

// Update a custom url
async function update(customUrl: CustomUrl): Promise<CustomUrl> {

    // Construct the query
    const query_st: string = `
        UPDATE custom_url
        SET url = $2, action = $3, target = $4, date_modified = NOW(), author_id = $5
        WHERE id = $1
        RETURNING *;
    `;

    try {
        // Execute the query
        const result = await query(query_st, [customUrl.id, customUrl.url, customUrl.action, customUrl.target, customUrl.author_id]);

        // Create a new CustomUrl object with the first row of the result
        return new CustomUrl(result.rows[0]);

    } catch (err) {
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

// Delete a custom url
async function remove(customUrl: CustomUrl): Promise<boolean> {

    // Construct the query
    const query_st: string = `
        DELETE FROM custom_url
        WHERE id = $1;
    `;

    try {
        // Execute the query
        await query(query_st, [customUrl.id]);

        return true;

    } catch (err) {
        console.error('Error occurred during query execution:', err);
        throw err;
    }
}

export {
    fetchByURL,
    fetchAll,
    insert,
    update,
    remove
};