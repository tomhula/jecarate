import { query } from "@/app/lib/db.server";

export async function findUserOrCreate(username: string): Promise<string>
{
    const [queryResult, _] = await query("SELECT id FROM user WHERE username = ?", [username]) as any[];
    if (queryResult.length === 0)
    {
        await query("INSERT INTO user (username) VALUES (?)", [username]);
        const [newUser, _] = await query("SELECT id FROM user WHERE username = ?", [username]) as any[];
        return newUser[0].id;
    }
    return queryResult[0].id;
}

export async function findFoodIdOrCreate(foodId: string, isSoup: number): Promise<number>
{
    const [queryResult, _] = await query("SELECT id FROM food WHERE name = ?", [foodId]) as any[];
    console.log(isSoup)
    if (queryResult.length === 0)
    {
        await query("INSERT INTO food (name, is_soup) VALUES (?, ?)", [foodId, isSoup]);
        const [newFood, _] = await query("SELECT id FROM food WHERE name = ?", [foodId]) as any[];
        return newFood[0].id;
    }
    return queryResult[0].id;
}