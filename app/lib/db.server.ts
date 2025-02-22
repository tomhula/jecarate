'use server'

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { getJecaratePath } from "@/app/lib/util";
import * as process from "node:process";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT as string),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function executeSQLScript(): Promise<boolean>
{
    try
    {
        const scriptPath = path.join(getJecaratePath(process.cwd()), '/sql/script.sql') // Adjust path if needed
        const script = fs.readFileSync(scriptPath, 'utf8');

        const connection = await pool.getConnection();
        const queries = script.split(';').map((q) => q.trim()).filter((q) => q.length > 0);

        for (const query of queries)
        {
            await connection.query(query);
        }

        connection.release();
        console.log('SQL script executed successfully');
        return true;
    }
    catch (error)
    {
        console.error('Error executing SQL script:', error);
        return false;
    }
}

export async function query(sql: string, values: any)
{
    return pool.query(sql, values);
}
