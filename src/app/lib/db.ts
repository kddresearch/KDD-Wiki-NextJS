import { Pool, QueryResult } from "pg";
import env_config from "@/config";

const poolconfig = {
    user: env_config.db.username,
    host: env_config.db.host,
    database: env_config.db.name,
    password: env_config.db.password,
    port: env_config.db.port,
    ssl: true,
}

// console.log("poolconfig: ", poolconfig);

const pool = new Pool(poolconfig);

var connected = false;

function connect(): void {
    pool.connect((err: Error | undefined, client: any, done: any) => {
        if (err) {
            console.error("Database connection error", err.stack);
        } else {
            console.log("Connected to PostgreSQL");
            client.release();
        }
    });

    connected = true;
}

/**
 * Executes a query on the PostgreSQL database | ***use specific query functions instead***
 */
async function query(text: string, params?: any[]): Promise<QueryResult> {
    if (!connected) {
        connect();
    }

    // time the query
    // const start = Date.now();

    try {
        // console Debug
        // console.log('Executing query:', text + "\n" + params);
        const result = await pool.query(text, params);

        // time the query
        // const duration = Date.now() - start;
        // console.log("table : ", text);
        // console.log("Query duration: ", duration);

        return result;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        console.error("Query: ", text + "\n" + params);

        throw err;
    }
}

// can connect
async function testConnection(): Promise<boolean> {
    try {
        connect();
        await query("SELECT NOW()");
        return true;
    } catch (err) {
        console.error("Error occurred during testConnection:", err);
        return false;
    }
}

export { query, testConnection };
