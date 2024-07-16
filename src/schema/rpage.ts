import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const rPageTable = pgTable('r_pages', {
    id: serial('id').primaryKey(), 
    title: varchar('title', { length: 50 }).notNull(),
    content: text('content'),
    author_id: integer('author_id'),
    category_id: integer('category_id').notNull(), 
    views: integer('views').notNull().default(0),
    access_level: varchar('access_level').notNull(),
    date_created: date('date_created').defaultNow(), 
    date_modified: date('date_modified').defaultNow(),
});