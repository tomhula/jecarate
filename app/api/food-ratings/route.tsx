import { query } from "@/app/lib/db.server";
import { NextRequest, NextResponse } from "next/server";
import { FormAnswer } from "@/app/lib/util";

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

export async function POST(req: NextRequest)
{
    const { foodId, answers } = await req.json();
    if (!foodId || !answers)
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    console.log(answers);
    console.log(foodId);

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
