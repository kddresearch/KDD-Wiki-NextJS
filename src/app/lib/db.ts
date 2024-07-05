import { 
    Pool,
    QueryResult,
    Client,
    PoolConfig
} from "pg";
import { 
    pgTable,
    serial,
    text,
    varchar
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import getConfig from "@/config";
const env_config = await getConfig();

let poolConfig: PoolConfig;

poolConfig = {
    user: env_config!.Db!.Username,
    host: env_config!.Db!.Host,
    database: env_config!.Db!.Name,
    password: env_config!.Db!.Password,
    port: parseInt(env_config!.Db!.Port?.toString() || "5432"), // Default port is 5432, if not specified
    ssl: true
}

const pool = new Pool(poolConfig);

var connected = false;

async function connectDrizzle() {

    try {
        const client = new Client(poolConfig);
        await client.connect();
        const db = drizzle(client);
    } catch (err: any) {
        console.error("Database connection error", err.stack);
    }
}

async function connect() {

    await connectDrizzle();

    pool.connect((err: Error | undefined, client: any, done: any) => {
        if (err) {
            console.error("Database connection error", err.stack);
        } else {
            client.release();
        }
    });

    connected = true;
}

/**
 * ### ***DO NOT USE*** OUTSIDE SPECIFIC QUERY FUNCTIONS
 * 
 * Executes a query on the PostgreSQL database
 */
async function query(text: string, params?: any[]): Promise<QueryResult> {
    if (!connected) {
        connect();
    }

    try {
        const result = await pool.query(text, params);
        return result;
    } catch (err) {
        console.error("Error occurred during query execution:", err);
        console.error("Query: ", text + "\n" + params);

        throw err;
    }
}

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
