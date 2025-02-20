import { NextResponse } from "next/server"
import { ICanteenWebClient } from "@/app/lib/icanteen-web-client"
import { JWTHandler } from "@/app/lib/jwt"

const jwtHandler = new JWTHandler()

export async function GET(req: Request)
{
    
}

export async function POST(reg: Request)
{
    const { username, password } = await reg.json()

    console.log(`Received login request for user ${username} with password ${password}`)

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
