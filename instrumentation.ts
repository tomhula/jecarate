import { executeSQLScript } from "@/app/lib/db";

export function register()
{
    executeSQLScript().then();
}