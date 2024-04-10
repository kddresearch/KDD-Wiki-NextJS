import { query } from "../db";
import { ActivityType, UserActivity } from "../models/user_activity";

async function fetchAll(): Promise<UserActivity[]> {
    // Construct the query
    const query_str: string = `
            SELECT * FROM user_activity
        `;
    
    try {
        // Execute the query
        const result = await query(query_str);
    
        return result.rows.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByUserId(userid: number) : Promise<UserActivity[]> {
    // Construct the query
    const query_str: string = `
            SELECT * FROM user_activity
            WHERE user_id = $1
        `;

    try {
        // Execute the query
        const result = await query(query_str, [userid]);

        return result.rows.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function fetchByActivityType(activityType: ActivityType) : Promise<UserActivity[]> {
    // Construct the query
    const query_str: string = `
            SELECT * FROM user_activity
            WHERE activity_type = $1
        `;

    try {
        // Execute the query
        const result = await query(query_str, [activityType]);

        return result.rows.map((row: any) => new UserActivity(row));
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}

async function insert(userActivity: UserActivity): Promise<UserActivity> {
    // Construct the query
    const query_str: string = `
            INSERT INTO user_activity (user_id, activity_type, activity_details, timestamp)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

    try {
        // Execute the query
        const result = await query(query_str, [userActivity.userId, userActivity.activityType, userActivity.activityDetails, userActivity.timestamp]);

        return new UserActivity(result.rows[0]);
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        throw err;
    }
}