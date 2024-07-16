import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const rPageVersionTable = pgTable('r_page_versions', {
    id: serial('id').primaryKey(),
    page_id: integer('page_id').notNull(), 
    content: text('content').notNull(), 
    author: integer('author').notNull(), 
    date_created: date('date_created').notNull() 
});