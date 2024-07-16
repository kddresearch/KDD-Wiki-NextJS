import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const rCategoryTable = pgTable('r_categories', {
    id: serial('id').primaryKey(), 
    role: varchar('role').notNull(),
    name: varchar('name', { length: 50 }).notNull(), 
    description: text('description').notNull(), 
    date_created: date('date_created').defaultNow(), 
    date_modified: date('date_modified').defaultNow()
});