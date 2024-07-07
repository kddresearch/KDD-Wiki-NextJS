import Joi from "joi";
import { AccessLevel } from "./wikiuser";
import Page from "./_page";
import {SQL,sql} from 'drizzle-orm'
import rPageVersion from "./rpage_version";

import { pgTable, integer, varchar, text, date, serial, AnyPgColumn,uniqueIndex } from 'drizzle-orm/pg-core';
import { Index, IndexColumn } from "drizzle-orm/mysql-core";


const rpageSchema = Joi.object({
    id: Joi.number().integer().min(0),
    title: Joi.string().max(50).lowercase().required(),
    content: Joi.string().min(0),
    author_id: Joi.number().integer().min(0).required(),
    category_id: Joi.number().integer().min(0).required(),

    views: Joi.number().integer().min(0).default(0),
    access_level: Joi.string().valid(...Object.values(AccessLevel)).required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});



export const rPageTable = pgTable('r_pages', {
  id: serial('id').primaryKey(), 
  title: varchar('title', { length: 50 }).notNull(),
  content: text('content'),
  author_id: integer('author_id'),
  category_id: integer('category_id').notNull(), 
  views: integer('views').notNull().default(0),
  access_level: varchar('access_level').notNull(),
  date_created: date('date_created').notNull(), 
  date_modified: date('date_modified').notNull(),
      email: text('email').notNull(),

    },);


class rPage {
    id: number;
    title: string;
    content: string;

    // relationships
    author_id: number;
    category_id: number;

    views: number;
    access_level: AccessLevel;
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Convert author_id and category_id to numbers if they are strings
        data.author_id = Number(data.author_id);
        data.category_id = Number(data.category_id);
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = rpageSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(
                `Page validation error: ${error.message}\nCurrent Value: ${data[error.name]}`,
            );
        }

        // Assign the validated values to the Page object
        this.id = value.id;
        this.title = value.title;
        this.content = value.content;
        this.author_id = value.author_id;
        this.category_id = value.category_id;

        // this.versionId = value.versionId;

        this.views = value.views;
        this.access_level = value.access_level;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }

    /**
     * Update the page with the new page data
     */
    update(page: rPage) {
        this.title = page.title;
        this.content = page.content;
        this.author_id = page.author_id;
        this.category_id = page.category_id;

        // update content
        // this.updatePageContent(page.content, page.author);

        // this.views = page.views;
        this.access_level = page.access_level;
        this.date_created = page.date_created;
        this.date_modified = page.date_modified;
    }

    view() {
        this.views++;
    }

    static fromPage(page: Page) {
        return new rPage({
            id: page.id,
            title: page.title,
            content: page.content,
            author_id: page.author_id,
            category_id: null,

            access_level: page.is_kdd_only ? AccessLevel.Member : AccessLevel.ReadOnly,
            views: 0,
            date_created: page.date_created,
            date_modified: page.date_modified,
        });
    }
}

// CREATE TABLE rpage (
//     id SERIAL PRIMARY KEY,
//     title TEXT NOT NULL,
//     content TEXT NOT NULL,
//     author_id INTEGER NOT NULL,
//     category_id INTEGER NOT NULL,
//     version_id INTEGER NOT NULL,
//     views INTEGER NOT NULL DEFAULT 0,
//     access_level TEXT NOT NULL,
//     date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// );

export default rPage;