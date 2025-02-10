import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// get all users
export async function GetAllUsers() {
    try {
        const users = await prisma.user.findMany();
        return Response.json(users);
    } catch (error) {
        return Response.json({ error: "Error fetching users" }, { status: 500 });
    }
}

// create a new user
export async function CreateNewUser(req: Request) {
    try {
        const { email, password } = await req.json();

        const newUser = await prisma.user.create({
            data: { email, password },
        });
        return Response.json(newUser);
    } catch (error) {
        return Response.json({ error: "Error creating user" }, { status: 500 });
    }
}

export async function CheckUserCredentials(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || password != user.password) {
            return Response.json({ error: "Invalid email or password" }, { status: 401 });
        }

        return Response.json({ message: "Login successful", user });
    } catch (error) {
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}

