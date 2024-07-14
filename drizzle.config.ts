import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// import getConfig from "@/config";
// const config = await getConfig();

console.log("DB_NAME: ", process.env.DB_NAME);

export default defineConfig({
    schema: "./src/lib/models/*",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        // database: config!.Db!.Name!,
        // host: config!.Db!.Host!,
        // port: parseInt(config!.Db!.Port!),
        // user: config!.Db!.Username!,
        // password: config!.Db!.Password!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        user: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        ssl: true
    }
});