import { sign, verify, SignOptions } from 'jsonwebtoken';

export class JWTHandler
{
    private readonly secret = process.env.JWT_SECRET || "default-secret"

    signJWT(payload: { username: string }, options: SignOptions = {}): string
    {
        options.expiresIn = options.expiresIn || '30m';
        return sign(payload, this.secret, options);
    }

    verifyJWT(token: string): { username: string } | { error: string }
    {
        try
        {
            const decoded = verify(token, this.secret) as { username: string };
            return { username: decoded.username };
        }
        catch (error: any)
        {
            if (error.name === "TokenExpiredError")
            {
                return { error: "TokenExpiredError" };
            }
            return { error: "Server error occurred when parsing the JWT" };
        }
    }
}