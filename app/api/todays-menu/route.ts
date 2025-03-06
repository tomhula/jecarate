import { NextRequest, NextResponse } from "next/server";
import {getMenu} from "@/app/lib/canteen/CanteenMenuParser";
import { jwtHandler } from "@/app/lib/util";
import { query } from "@/app/lib/db.server";

export async function GET(req: NextRequest)
{

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: "Missing or invalid Authorization header" }, { status: 401 });
    }
    const userToken = authHeader.split(' ')[1];
    const userName = jwtHandler.verifyJWT(userToken)
    if ('error' in userName)
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const [hasRated, _]: any = await query("CALL HasRatedToday(?)", [userName.username]);
    const hasRatedMeal = hasRated[0].some((record: { is_soup: number }) => record.is_soup === 0);
    const hasRatedSoup = hasRated[0].some((record: { is_soup: number }) => record.is_soup === 1);

    const dayMenus = await getMenu();

    const today = new Date();
    const todayMenu = dayMenus.find(menu => menu.date.toDateString() === today.toDateString());

    if (todayMenu === undefined)
        return NextResponse.json({message: "No menu available for today"}, { status: 404 });


    return NextResponse.json({ todayMenu: todayMenu, hasRatedSoup: hasRatedSoup, hasRatedMeal: hasRatedMeal });
}
