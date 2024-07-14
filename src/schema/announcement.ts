import { pgTable, integer, varchar, text, date, serial, jsonb, boolean } from 'drizzle-orm/pg-core';

export const announcementTable = pgTable('announcements', {
    //auto-increment key?
    id: serial('id'),
    title: varchar('title', { length: 50 }).notNull(), 
    content: text('content').notNull(), 
    date_created: date('date_created').notNull(), 
    date_modified: date('date_modified').notNull(), 
    //min 0
    author_id: integer('author_id').notNull(),
    is_old: boolean('is_old').notNull() 
});