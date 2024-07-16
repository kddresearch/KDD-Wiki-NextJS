import { pgTable, integer, text, varchar, boolean, date, serial } from 'drizzle-orm/pg-core'

export const pageTable = pgTable('page', {
    id: serial('id').primaryKey(),
    title: varchar('title',{length:50}).notNull(),
    //min 0
    priority: integer('priority').default(1000).notNull(),
    //min 0
    content: text('content'),
    discussion: text('discussion'),
    is_private: boolean('is_private').notNull(),
        is_kdd_only: boolean('is_kdd_only').notNull(),

    date_created: date('date_created').defaultNow(),
    date_modified: date('date_modified').defaultNow(),
    //to be required
    category_id: integer('category_id'),
    //min 0
    author_id: integer('author_id').notNull(),
    //to be required
    name: varchar('name',{length:50}),
    has_publication: boolean('has_publication').notNull(),
    //to be required
    last_updated: text('last_updated'),
    //to be required
    is_home: boolean('is_home'),
    //to be required
    is_template: boolean('is_template'),
});