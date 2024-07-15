import { 
    Pool,
    QueryResult,
    Client,
    PoolConfig
} from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import getConfig from "@/config";
import { sql } from "drizzle-orm";
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

let db: ReturnType<typeof drizzle>;

async function connectDrizzle() {
    try {
        const client = new Client(poolConfig);
        await client.connect();

        if (await testConnection() === false) {
            console.error("Database connection failed");
            return;
        }

        db = drizzle(client);
    } catch (err: any) {
        console.error("Database connection error", err.stack);
    }
}

await connectDrizzle();

export {
    db
};

async function testConnection(): Promise<boolean> {
    try {
        const result = db.execute(sql`SELECT 1`);

        if (result === undefined) {
            return false;
        }

        return true;
    } catch (err) {
        console.error("Error occurred during testConnection:", err);
        return false;
    }
}

export { 
    testConnection
};
