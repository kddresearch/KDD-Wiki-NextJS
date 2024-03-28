import { Pool, QueryResult } from 'pg';
import config from '@/config.json';

const pool = new Pool({
    user: config.db.username,
    host: config.db.host,
    database: config.db.name,
    password: config.db.password,
    port: config.db.port,
});

var connected = false;

function connect(): void {
    pool.connect((err: Error | undefined, client: any, done: any) => {
        if (err) {
          console.error('Database connection error', err.stack);
        } else {
          console.log('Connected to PostgreSQL');
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

    try {
        // console Debug
        // console.log('Executing query:', text + "\n" + params);
        const result = await pool.query(text, params);
        return result;
    } catch (err) {
        console.error('Error occurred during query execution:', err);
        console.error('Query: ', text + "\n" + params);
    
        throw err; 
    }
}

export { query };