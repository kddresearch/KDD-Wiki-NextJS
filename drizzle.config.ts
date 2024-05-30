import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("DB_NAME: ", process.env.DB_NAME);

export default defineConfig({
    schema: "./src/schema/*",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        // name: process.env.DB_NAME!,
        database: process.env.DB_NAME!,
        host: process.env.DB_HOST_LOCAL!,
        port: parseInt(process.env.DB_PORT!),
        user: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        ssl: false
    }
});