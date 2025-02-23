import { query } from "@/app/lib/db.server";
import { NextResponse } from "next/server";

export async function GET()
{
    try
    {
        const [queryResult, _] = await query("SELECT * FROM all_ratings", []);
        return NextResponse.json(queryResult);
    }
    catch (error)
    {
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    }
}


