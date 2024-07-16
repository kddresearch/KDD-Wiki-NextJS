import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const rpublicationTable = pgTable('r_publications', {
    id: serial('id').primaryKey(), 
    content: text('content').notNull(), 
    platforms: jsonb('platforms').notNull(), 
    date_published: date('date_published').notNull(),
    project_id: integer('project_id').notNull(), 
    author_ids: integer('author_ids').array().notNull(), 
    category_ids: integer('category_ids').array().notNull(),
    date_created: date('date_created').notNull(), 
    date_modified: date('date_modified').notNull()
});