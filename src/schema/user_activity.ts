import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';

export const userActivityTable = pgTable('user_activities', {
    id: serial('id').primaryKey(), 
    userId: integer('user_id').notNull(), 
    activityType: varchar('activity_type').notNull(),
    endpoint: varchar('endpoint').notNull(), 
    detected_ip: varchar('detected_ip').notNull(), 
    status: integer('status').notNull(), 
    activityDetails: text('activity_details').notNull(), 
    timestamp: date('timestamp').notNull().defaultNow()
});
