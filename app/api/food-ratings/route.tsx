import { query } from "@/app/lib/db.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET()
{
    try
    {
        const [queryResult, _] = await query(
            "SELECT DISTINCT food_name, AVG(rating) as rating, lunch_date FROM all_ratings GROUP BY food_name, lunch_date ORDER BY lunch_date DESC",
            []);
        return NextResponse.json(queryResult);
    }
    catch (error)
    {
        console.log(error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    }
}

export async function POST(req: NextRequest)
{
    const { foodId, answers } = await req.json();
    if (!foodId || !answers)
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    const answerKeys = Object.keys(answers);
    if (answerKeys.length !== 5 || !answerKeys.every(key => typeof answers[key] === 'number'))
        return NextResponse.json({ message: "Invalid answers" }, { status: 400 });

    // Remove beverage from the foodId
    const foodDbId = await findFoodIdOrCreate(foodId.split(',').slice(0, -1).join(', ').trim())
    const averageRating = Object.values(answers).reduce((sum: number, value) => sum + (value as number), 0) / answerKeys.length;
    try
    {
        await query(
            "INSERT INTO lunch_rating (food_id, rating, lunch_date) VALUES (?, ?, CURDATE())",
            [foodDbId, averageRating]
        );
        return NextResponse.json({ message: "Rating submitted successfully" });
    }
    catch (error)
    {
        return NextResponse.json({ message: "Error saving rating" }, { status: 500 });
    }
}

async function findFoodIdOrCreate(foodId: string): Promise<string>
{
    const [queryResult, _] = await query("SELECT id FROM food WHERE name = ?", [foodId]) as any[];
    if (queryResult.length === 0)
    {
        await query("INSERT INTO food (name) VALUES (?)", [foodId]);
        const [newFood, _] = await query("SELECT id FROM food WHERE name = ?", [foodId]) as any[];
        return newFood[0].id;
    }
    return queryResult[0].id;
}
