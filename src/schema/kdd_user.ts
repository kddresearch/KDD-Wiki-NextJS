import { pgTable, integer, varchar, text, date, serial, jsonb, boolean } from 'drizzle-orm/pg-core';

export const kddUserTable = pgTable('kdd_user', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull(), 
    //to be required
    member: boolean('member').notNull().default(false),
    //to be required
    admin: boolean('admin').notNull().default(false),
    //to be requried
    readonly: boolean('readonly').notNull().default(false),
    date_created: date('date_created').defaultNow(),
    date_modified: date('date_modified').defaultNow(), 
    kdd_group_id: integer('kdd_group_id'),
    directory_group_id: integer('directory_group_id'),
    is_kdd_only: boolean('is_kdd_only').notNull() 
});