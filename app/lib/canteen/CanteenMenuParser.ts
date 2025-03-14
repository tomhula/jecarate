import {JSDOM} from "jsdom";


export interface MenuItem
{
    number: number;
    soup: string;
    description: string;
}

export interface DayMenu
{
    date: Date;
    items: MenuItem[];
}

// Cache structure to store menu data and its timestamp
interface MenuCache {
    data: DayMenu[];
    timestamp: Date;
}

// In-memory cache
let menuCache: MenuCache | null = null;

// Function to check if the cache is valid (less than a day old)
function isCacheValid(): boolean {
    if (!menuCache) return false;

    const now = new Date();
    const cacheDate = new Date(menuCache.timestamp);

    // If it's early morning (before 8 AM) and the cache is from yesterday or earlier,
    // invalidate the cache to force a refresh for the new day
    if (now.getHours() < 8) {
        // If the cache is not from today, force a refresh
        if (now.toDateString() !== cacheDate.toDateString()) {
            console.log("Early morning refresh: invalidating yesterday's cache");
            return false;
        }
    }

    // Check if the cache is from today
    return now.toDateString() === cacheDate.toDateString();
}

// Original function to fetch menu from the server
async function fetchMenuFromServer(): Promise<DayMenu[]>
{
    const response = await fetch('https://strav.nasejidelna.cz/0341/login', {
        method: 'GET',
        redirect: 'manual',
        headers: {
            'Accept': '*/*'
        }
    });

    const html = await response.text();
    const dom = new JSDOM(html).window.document;

    const dayEles = dom.querySelectorAll('.jidelnicekDen');

    const dayMenus: DayMenu[] = [];

    for (const dayEle of dayEles)
    {
        const items: MenuItem[] = [];
        const date = new Date(dayEle.querySelector(".jidelnicekTop")!.id.replace("day-", ""))
        const menuItemEles = Array.from(dayEle.querySelectorAll(".container")).slice(0, 2);
        menuItemEles.forEach((menuItemEle, index) => {
            const number = index + 1;
            const fullName = menuItemEle.querySelector(".column.jidelnicekItem")!.childNodes[0].textContent!!.replace(/[\t\n]| {2}/g, "").replaceAll("  ", " ").replace(" ,", ",").trim();
            const [soup, ...descriptionParts] = fullName.split(", ");
            const description = descriptionParts.join(", ");
            items.push({number, soup, description});
        })
        dayMenus.push({date, items});
    }

    return dayMenus;
}

// Main function that uses cache when available
export async function getMenu(): Promise<DayMenu[]>
{
    const now = new Date();

    // Check if we have a valid cache
    if (isCacheValid()) {
        console.log(`[${now.toISOString()}] Using cached menu data from ${menuCache!.timestamp.toISOString()}`);
        return menuCache!.data;
    }

    // If no valid cache, fetch from server
    console.log(`[${now.toISOString()}] Cache invalid or not found. Fetching fresh menu data from server`);
    const menuData = await fetchMenuFromServer();

    // Update the cache
    menuCache = {
        data: menuData,
        timestamp: now
    };

    console.log(`[${now.toISOString()}] Menu cache updated with ${menuData.length} day menus`);

    return menuData;
}
