export async function register()
{
    if (process.env.NEXT_RUNTIME === 'nodejs')
    {
        const { executeSQLScript } = await import("@/app/lib/db.server");
        try
        {
            const success = await executeSQLScript();
            if (!success)
            {
                console.error('Failed to initialize database');
                process.exit(1);
            }
        }
        catch (error)
        {
            console.error('Failed to initialize database:', error);
            process.exit(1);
        }
    }
}