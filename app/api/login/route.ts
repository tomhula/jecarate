import { NextResponse } from "next/server";
import {redirect} from "next/navigation";

export async function GET()
{
    return NextResponse.json( { message: "Hello from login GET" } );
}

export async function POST()
{
    return redirect('/food-rating');
}
