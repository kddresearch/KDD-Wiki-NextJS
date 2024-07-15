import { ActivityType, UserActivity } from "@/models/user_activity";
import { userActivityTable } from "@/schema/user_activity";
import { db } from "@/db"
import { eq, inArray, isNull, or, asc, desc, and } from 'drizzle-orm'

async function fetchAll(): Promise<UserActivity[]> {
    
    try {
        // Execute the query
        const result = await db!.select().from(userActivityTable)
        return result.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUserId(userid: number) : Promise<UserActivity[]> {

    try {
        const result = await db!.select().from(userActivityTable).where(eq(userActivityTable.userId,userid))
        return result.map((row: any) => new UserActivity(row));

    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByActivityType(activityType: ActivityType) : Promise<UserActivity[]> {
   
    try {
       
        const result = await db!.select().from(userActivityTable).where(eq(userActivityTable.activityType,activityType))
        return result.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(userActivity: UserActivity): Promise<UserActivity> {

    try {
        
        const result = await db!.insert(userActivityTable).values({
            userId : userActivity.userId,
            activityType : userActivity.activityType,
            activityDetails : userActivity.activityDetails,
            endpoint : userActivity.endpoint,
            detected_ip : userActivity.detected_ip,
            status : userActivity.status
        })
        .returning()
        return new UserActivity(result[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}