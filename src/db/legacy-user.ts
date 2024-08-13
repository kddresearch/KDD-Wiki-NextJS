import LegacyUser from "@/models/legacy-user";
import { kddUserTable } from "@/schema/kdd_user";
import { eq } from 'drizzle-orm'
import { db } from '@/db'

async function fetchAll(): Promise<LegacyUser[]> {
    try {
        const result = await db!.select().from(kddUserTable);
        
        return result.map((row: any) => new LegacyUser(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUsername(username: string): Promise<LegacyUser> {
    try {  
        const result = await db!.select().from(kddUserTable).where(eq(kddUserTable.username, username));

        return new LegacyUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(user: LegacyUser): Promise<LegacyUser> {
    try {
        const result = await db!.insert(kddUserTable).values({
            username : user.username,
            member : user.member,
            admin : user.admin,
            readonly : user.readonly,
            kdd_group_id : user.kdd_group_id, 
            directory_group_id : user.directory_group_id,
            is_kdd_only : user.is_kdd_only
        })
        .returning();

        return new LegacyUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export { fetchAll, fetchByUsername, insert };
