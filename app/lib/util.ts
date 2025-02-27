import path from 'path';
import { JWTHandler } from "@/app/lib/jwt";

export interface FormAnswer
{
    ration: number | null,
    taste: number | null,
    price: number | null,
    temperature: number | null,
    looks: number | null,
    desert: number | null

    [key: string]: number | null
}

export const jwtHandler = new JWTHandler()

export function getJecaratePath(cwd: string): string
{
    const targetDir = 'jecarate';
    const parts = cwd.split(path.sep);

    while (parts.length > 0)
    {
        if (parts[parts.length - 1] === targetDir)
        {
            return parts.join(path.sep);
        }
        parts.pop();
    }

    return path.join(cwd, targetDir);
}