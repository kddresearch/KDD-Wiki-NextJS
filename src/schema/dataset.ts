import { pgTable, integer, varchar, text, date, serial, jsonb, boolean } from 'drizzle-orm/pg-core';

export const datasetTable = pgTable('datasets', {
    id: serial('id').primaryKey(), 
    name: varchar('name').notNull(), 
    description: text('description').notNull(), 
    is_confidential: boolean('is_confidential').notNull(), 
    link: text('link').notNull(), 
    accessed: date('accessed').notNull(), 
    type: text('type').notNull(),
    date_created: date('date_created').notNull(), 
    date_modified: date('date_modified').notNull(), 
});