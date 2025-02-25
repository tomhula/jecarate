import { query } from "@/app/lib/db.server";
import { NextRequest, NextResponse } from "next/server";
import { jwtHandler } from "@/app/lib/util";
import { findFoodIdOrCreate, findUserOrCreate } from "@/app/api/food-ratings/util";

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
    const { foodId, answers, userToken } = await req.json();
    if (!foodId || !answers)
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    const answerKeys = Object.keys(answers);
    if (answerKeys.length !== 5 || !answerKeys.every(key => typeof answers[key] === 'number'))
        return NextResponse.json({ message: "Invalid answers" }, { status: 400 });

    const jwtParsed = jwtHandler.verifyJWT(userToken)
    if ('error' in jwtParsed)
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const userId = await findUserOrCreate(jwtParsed.username)

    if (userId.length === 0)
        return NextResponse.json({ message: "User not found" }, { status: 404 });

    let foodDbId: number
    if (foodId.split(',').length > 1)
        foodDbId = await findFoodIdOrCreate(foodId.split(',').slice(0, -1).join(', ').trim())
    else
        foodDbId = await findFoodIdOrCreate(foodId)
    try
    {
        await query(
            "INSERT INTO lunch_rating (food_id, user_id, ration, taste, price, temperature, looks, lunch_date) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())",
            [foodDbId, userId, answers.ration, answers.taste, answers.price, answers.temperature, answers.looks]
        );
        return NextResponse.json({ message: "Rating submitted successfully" });
    }
    catch (error)
    {
        return NextResponse.json({ message: "Error saving rating" }, { status: 500 });
    }
}
