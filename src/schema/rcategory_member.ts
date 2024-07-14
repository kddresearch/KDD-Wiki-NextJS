import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const rCategoryMemberTable = pgTable('r_category_members', {
    category_id: integer('category_id').notNull(), 
    user_id: integer('user_id').notNull()
});