import { query } from "../db";
import { ActivityType, UserActivity,userActivityTable } from "../models/user_activity";
import {db} from "../db"
import {eq,inArray,isNull,or,asc,desc,and} from 'drizzle-orm'

async function fetchAll(): Promise<UserActivity[]> {
    // Construct the query
    // const query_str: string = `
    //         SELECT * FROM user_activity
    //     `;
    
    try {
        // Execute the query
        // const result = await query(query_str);
        const result = await db!.select().from(userActivityTable)
    
        return result.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUserId(userid: number) : Promise<UserActivity[]> {
    // Construct the query
    // const query_str: string = `
    //         SELECT * FROM user_activity
    //         WHERE user_id = $1
    //     `;

    try {
        // Execute the query
        // const result = await query(query_str, [userid]);
        const result = await db!.select().from(userActivityTable).where(eq(userActivityTable.userId,userid))


        return result.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByActivityType(activityType: ActivityType) : Promise<UserActivity[]> {
    // Construct the query
    // const query_str: string = `
    //         SELECT * FROM user_activity
    //         WHERE activity_type = $1
    //     `;

    try {
        // Execute the query
        // const result = await query(query_str, [activityType]);
        const result = await db!.select().from(userActivityTable).where(eq(userActivityTable.activityType,activityType))


        return result.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(userActivity: UserActivity): Promise<UserActivity> {
    // Construct the query
    // const query_str: string = `
    //         INSERT INTO user_activity (user_id, activity_type, activity_details, timestamp)
    //         VALUES ($1, $2, $3, $4)
    //         RETURNING *
    //     `;

    try {
        // Execute the query
        //const result = await query(query_str, [userActivity.userId, userActivity.activityType, userActivity.activityDetails, userActivity.timestamp]);
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