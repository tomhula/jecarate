import {NextResponse} from "next/server";
import {ICanteenWebClient} from "@/app/lib/icanteen-web-client";
import {redirect} from "next/navigation";

export async function GET(req: Request)
{
    const {searchParams} = new URL(req.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    if (!username || !password)
    {
        return NextResponse.json({error: "Username and password are required"}, {status: 400});
    }

    const auth = {username, password};
    const canteenClient = new ICanteenWebClient();

    try
    {
        const loginSuccess = await canteenClient.login(auth);
        if (loginSuccess)
        {
            return NextResponse.json({message: `Login successful for ${username}`});
        } else
        {
            return NextResponse.json({error: "Invalid credentials"}, {status: 401});
        }
    } catch (e)
    {
        return NextResponse.json(
            {
                error: "An error occurred during login",
                details: e instanceof Error ? e.message : String(e)
            },
            {status: 500}
        );
    }
}

export async function POST()
{
    return redirect("/food-rating");
}
