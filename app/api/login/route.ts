import { NextResponse } from "next/server"
import { ICanteenWebClient } from "@/app/lib/icanteen-web-client"
import { jwtHandler } from "@/app/lib/util";

export async function GET(req: Request)
{
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token)
    {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const verifiedToken = jwtHandler.verifyJWT(token);

    if ('error' in verifiedToken)
    {
        if (verifiedToken.error === 'TokenExpiredError')
            return NextResponse.json({ error: "Token is expired" }, { status: 400 });

        return NextResponse.json({ error: "Token is invalid" }, { status: 400 });
    }

    return NextResponse.json({ message: "Token is valid", data: verifiedToken }, { status: 200 });
}

export async function POST(reg: Request)
{
    const { username, password } = await reg.json()
    
    if (!username || !password)
    {
        return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const auth = { username, password }
    const canteenClient = new ICanteenWebClient()

    try
    {
        const loginSuccess = await canteenClient.login(auth)
        if (loginSuccess)
        {
            const token = jwtHandler.signJWT({ username: username }, { expiresIn: '15m' })
            return NextResponse.json({ token: token })
        }
        else
        {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }
    }
    catch (e)
    {
        return NextResponse.json(
            {
                error: "An error occurred during login",
                details: e instanceof Error ? e.message : String(e)
            },
            { status: 500 }
        )
    }
}
