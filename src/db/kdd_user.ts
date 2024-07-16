import KddUser from "@/models/kdd_user";
import { kddUserTable } from "@/schema/kdd_user";
import {eq,inArray,isNull,or,asc,desc} from 'drizzle-orm'
import {db} from '@/db'

async function fetchAll(): Promise<KddUser[]> {
    try {
        const result = await db!.select().from(kddUserTable);
        
        return result.map((row: any) => new KddUser(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUsername(username: string): Promise<KddUser> {
    try {  
        const result = await db!.select().from(kddUserTable).where(eq(kddUserTable.username, username));

        return new KddUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(user: KddUser): Promise<KddUser> {
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

        return new KddUser(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

export { fetchAll, fetchByUsername, insert };
