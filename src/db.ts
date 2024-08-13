import { 
    Pool,
    QueryResult,
    Client,
    PoolConfig
} from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import getConfig from "@/config";

let db: ReturnType<typeof drizzle>;

async function connectDrizzle() {
    const env_config = await getConfig();

    const poolConfig: PoolConfig = {
        user: env_config!.Db!.Username,
        host: env_config!.Db!.Host,
        database: env_config!.Db!.Name,
        password: env_config!.Db!.Password,
        port: parseInt(env_config!.Db!.Port?.toString() || "5432"), // Default port is 5432, if not specified
        ssl: true
    }

    try {
        const client = new Client(poolConfig);
        await client.connect();

        db = drizzle(client);

        if (await testConnection() === false) {
            throw new Error("Database connection failed");
        }

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
