import Announcement from "@/models/announcement";
import { db } from "@/db";
import { announcementTable } from "@/schema/announcement";
import { eq, desc, isNull, or } from "drizzle-orm";

/**
 * Get all announcements
 */
async function fetchAll(): Promise<Announcement[]> {
    try {
        const announcements: Announcement[] = [];
        const result = await db!.select().from(announcementTable);

        result.map((row: any) => {
            announcements.push(new Announcement(row));
        });

        return announcements;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchCurrent(): Promise<Announcement[]> {
    try {
        const announcements: Announcement[] = [];
        const result = await db.select().from(announcementTable).where(
            or(
                eq(announcementTable.is_old, false),
                isNull(announcementTable.is_old)
            )
        ).orderBy(
            desc(announcementTable.date_created)
        );
    
        result.map((row: any) => {
            announcements.push(new Announcement(row));
        });
    
        return announcements;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchById(id: number): Promise<Announcement> {
    try {
        const announcements: Announcement[] = [];
        const result = await db!.select().from(announcementTable).where(eq(announcementTable.id, id));
    
        result.map((row: any) => {
            announcements.push(new Announcement(row));
        });
    
        return announcements[0];
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export { fetchAll, fetchCurrent, fetchById };
