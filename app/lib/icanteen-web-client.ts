/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/web/canteen/ICanteenWebClient.kt
Translated to typescript using ChatGPT and manual work
##############################################################################################################################
*/

import fetch, {RequestInit, Response} from 'node-fetch';
import {JSDOM} from 'jsdom';
import {URLSearchParams} from "next/dist/compiled/@edge-runtime/primitives";

export class ICanteenWebClient
{
    private static readonly ENDPOINT = "https://strav.nasejidelna.cz";
    private static readonly CANTEEN_CODE = "0341";
    private cookies: Map<string, string> = new Map();
    private autoLoginAttempted = false;
    private lastSuccessfulLoginAuth: { username: string; password: string } | null = null;
    private lastSuccessfulLoginTime: Date | null = null;

    constructor(private autoLogin: boolean = false)
    {
    }

    private async fetchWithCookies(url: string, options: RequestInit = {}): Promise<Response>
    {
        const cookieHeader = Array.from(this.cookies.entries()).map(([k, v]) => `${k}=${v}`).join('; ');
        options.headers = {...options.headers, Cookie: cookieHeader};
        options.redirect = "manual";
        url = this.appendQueryParams(url, {
            terminal: "false",
            printer: "false",
            keyboard: "false",
            status: "true"
        })

        const response = await fetch(url, options);

        const setCookieHeader = response.headers.raw()['set-cookie'];
        if (setCookieHeader)
        {
            setCookieHeader.forEach(cookie =>
            {
                const [name, value] = cookie.split(';')[0].split('=');
                this.cookies.set(name, value);
            });
        }
        return response;
    }

    private async getCsrfTokenFromCookie(): Promise<string | undefined>
    {
        return this.cookies.get("XSRF-TOKEN");
    }

    private findCsrfToken(html: string): string | null
    {
        const dom = new JSDOM(html);
        const input = dom.window.document.querySelector('input[name="_csrf"]');
        return input ? input.getAttribute('value') : null;
    }

    private async findCsrfTokenOrThrow(html: string): Promise<string>
    {
        const token = this.findCsrfToken(html);
        if (!token) throw new Error("CSRF token not found");
        return token;
    }

    async query(path: string, parameters: Record<string, string> = {}): Promise<Response>
    {
        const url = new URL(`${ICanteenWebClient.ENDPOINT}/${ICanteenWebClient.CANTEEN_CODE}/${path}`);
        Object.entries(parameters).forEach(([key, value]) => url.searchParams.append(key, value));

        const response = await this.fetchWithCookies(url.toString());
        if (response.headers.get("location")?.includes("login"))
        {
            if (this.autoLogin && !this.autoLoginAttempted)
            {
                this.autoLoginAttempted = true;
                await this.login(this.lastSuccessfulLoginAuth!);
                return this.query(path, parameters);
            } else
            {
                throw new Error("Authentication required");
            }
        }
        return response;
    }

    async login(auth: { username: string; password: string }): Promise<boolean>
    {
        const loginPageResponse = await this.query("login");
        const loginPageHtml = await loginPageResponse.text();
        const csrfToken = await this.findCsrfTokenOrThrow(loginPageHtml);

        const loginResponse = await this.fetchWithCookies(
            `${ICanteenWebClient.ENDPOINT}/${ICanteenWebClient.CANTEEN_CODE}/j_spring_security_check`,
            {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: new URLSearchParams({
                    j_username: auth.username,
                    j_password: auth.password,
                    _spring_security_remember_me: "on",
                    type: "web",
                    _csrf: csrfToken,
                    targetUrl: "/"
                }).toString()
            }
        );

        const success = !loginResponse.headers.get("location")?.includes("login_error=1");
        if (success)
        {
            this.lastSuccessfulLoginAuth = auth;
            this.lastSuccessfulLoginTime = new Date();
        }
        return success;
    }

    async logout(): Promise<void>
    {
        const csrfToken = (await this.getCsrfTokenFromCookie()) || (await this.findCsrfTokenOrThrow(await (await this.query("faces/secured/main.jsp")).text()));
        await this.fetchWithCookies(`${ICanteenWebClient.ENDPOINT}/${ICanteenWebClient.CANTEEN_CODE}/logout`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({_csrf: csrfToken}).toString()
        });
        await this.fetchWithCookies(`${ICanteenWebClient.ENDPOINT}/${ICanteenWebClient.CANTEEN_CODE}/logoutall`);
        this.lastSuccessfulLoginAuth = null;
    }

    async isLoggedIn(): Promise<boolean>
    {
        return !(await this.query("faces/secured/main.jsp")).headers.get("location")?.includes("login");
    }

    private appendQueryParams(url: string, params: Record<string, string>): string
    {
        // Create a URL object to handle parsing and serialization
        const urlObj = new URL(url);

        // Iterate over the params object and append each key-value pair to the searchParams
        for (const [key, value] of Object.entries(params))
        {
            urlObj.searchParams.append(key, value);
        }

        // Return the updated URL as a string
        return urlObj.toString();
    }
}
