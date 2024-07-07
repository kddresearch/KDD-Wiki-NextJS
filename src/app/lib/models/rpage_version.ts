import Joi from "joi";
import { pgTable, integer, text, date, serial } from 'drizzle-orm/pg-core';


const rPageVersionSchema = Joi.object({
    id: Joi.number().integer().min(0).required(),
    page_id: Joi.number().integer().min(0).required(),
    content: Joi.string().min(0).required(),
    author: Joi.number().integer().min(0).required(),
    date_created: Joi.date().required(),
});



export const rPageVersionTable = pgTable('r_page_versions', {
  id: serial('id').primaryKey(),
  page_id: integer('page_id').notNull(), 
  content: text('content').notNull(), 
  author: integer('author').notNull(), 
  date_created: date('date_created').notNull() 
});

class rPageVersion {
    id: number;
    page_id: number;
    content: string;
    author: number;
    date_created: Date;

    constructor(data: any) {
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = rPageVersionSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(`rPageVersion validation error: ${error.message}`);
        }

        this.id = value.id;
        this.page_id = value.page_id
        this.content = value.content;
        this.author = value.author;
        this.date_created = value.date_created;
    }
}

export default rPageVersion;

// CREATE TABLE page_version (
//     id SERIAL PRIMARY KEY,
//     page_id INTEGER NOT NULL REFERENCES rpage(id),
//     content TEXT NOT NULL,
//     author_id INTEGER NOT NULL,
//     date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE (page_id, id)
// );