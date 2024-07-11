import Joi from "joi";
import { pgTable, integer, varchar, text, date, serial } from 'drizzle-orm/pg-core';

enum CategoryType {
    research = "research",
    admin = "admin",
    // ...
}

const rCategorySchema = Joi.object({
    id: Joi.number().required(),
    role: Joi.string().valid(...Object.values(CategoryType)).required(),
    name: Joi.string().max(50).lowercase().required(),
    description: Joi.string().required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});





export const rCategoryTable = pgTable('r_categories', {
    id: serial('id').primaryKey(), 
    role: varchar('role').notNull(),
    name: varchar('name', { length: 50 }).notNull(), 
    description: text('description').notNull(), 
    date_created: date('date_created').defaultNow(), 
    date_modified: date('date_modified').defaultNow()
});


class rCategory {
    id: number;
    role: CategoryType
    name: string;
    description: string;
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Validate the data
        const { error, value } = rCategorySchema.validate(data);

        // If there is an error, throw an error
        if (error) {
            throw new Error(`ResearchCategory validation error: ${error.message}`);
        }

        this.id = value.id;
        this.role = value.role;
        this.name = value.name;
        this.description = value.description;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }

    update(rcategory: rCategory) {

        this.role = rcategory.role;
        this.name = rcategory.name;
        this.description = rcategory.description;
        this.date_modified = new Date();
    }
}

export default rCategory;

// SQL
// CREATE TABLE rcategory (
//     id SERIAL PRIMARY KEY,
//     role TEXT NOT NULL,
//     name TEXT NOT NULL,
//     description TEXT NOT NULL,
//     date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// );