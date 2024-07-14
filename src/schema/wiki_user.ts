import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const wikiUserTable = pgTable('wiki_users', {
    id: serial('id').primaryKey(), 
    username: varchar('username').notNull(), 
    access_level: varchar('access_level').notNull(),
    settings: jsonb('settings').notNull(), 
    first_name: varchar('first_name').notNull(), 
    last_name: varchar('last_name').notNull(), 
    bio: text('bio').notNull(), 
    email: varchar('email').notNull(),
    profile_picture: varchar('profile_picture').notNull(),
    phone_number: varchar('phone_number').notNull(), 
    social_media: jsonb('social_media').notNull(), 
    admin_teams: text('admin_teams').default('[]'), 
    date_created: date('date_created').defaultNow(), 
    date_modified: date('date_modified').defaultNow(), 
    last_login: date('last_login').notNull() 
});
