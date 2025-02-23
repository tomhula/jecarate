import {NextResponse} from "next/server";
import {getMenu} from "@/app/lib/canteen/CanteenMenuParser";

export async function GET()
{
    const dayMenus = await getMenu();

    const today = new Date();
    const todayMenu = dayMenus.find(menu => menu.date.toDateString() === today.toDateString());

    if (todayMenu === undefined)
        return NextResponse.json({message: "No menu available for today"}, {status: 404});

    return NextResponse.json(todayMenu || {message: "No menu available for today"});
}
