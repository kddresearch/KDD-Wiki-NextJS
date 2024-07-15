import { pgTable, integer, varchar, text, date, serial, jsonb, boolean } from 'drizzle-orm/pg-core';

export const customUrlTable = pgTable('custom_url', {
    id: serial('id').primaryKey(), 
    url: varchar('url', { length: 50 }).notNull(), 
    action: text('action').notNull(),
    target:text('target').notNull(),
    date_created: date('date_created').defaultNow(), 
    date_modified: date('date_modified').defaultNow(), 
    author_id: integer('author_id').notNull(), 
});