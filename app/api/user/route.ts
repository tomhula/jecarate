import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

/**
 * Returns a JSON response with all user submissions
 * @constructor
 */
export async function GET()
{
    const [queryResult, _] = await query("SELECT * FROM user", []);
    return NextResponse.json(queryResult);
}