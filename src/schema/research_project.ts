import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const researchProjectTable = pgTable('research_projects', {
    id: serial('id').primaryKey(), 
    title: varchar('title', { length: 50 }).notNull(), 
    category_id: integer('category_id').notNull(), 
    description: varchar('description',{length:2000}).notNull(), 
    methodology: varchar('methodology',{length:5000}).notNull(), 
    //Relationships
    tag_ids: integer('tag_ids').array().notNull(), 
    dataset_ids: integer('dataset_ids').array().notNull(), 
    personnel_ids: integer('personnel_ids').array().notNull(), 
    publication_ids: integer('publication_ids').array().notNull(), 
    funding_ids: integer('funding_ids').array().notNull(), 
    source_code_id: integer('source_code_id').notNull(), 

    // Metadata
    date_created: date('date_created').notNull(), 
    date_modified: date('date_modified').notNull() 
});