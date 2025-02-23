import {JSDOM} from "jsdom";


export interface MenuItem
{
    number: number;
    description: string;
}

export interface DayMenu
{
    date: Date;
    items: MenuItem[];
}

export async function getMenu(): Promise<DayMenu[]>
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
            const description = menuItemEle.querySelector(".column.jidelnicekItem")!.childNodes[0].textContent!!.replace(/[\t\n]| {2}/g, "").replaceAll("  ", " ").replace(" ,", ",").trim();
            items.push({number, description});
        })
        dayMenus.push({date, items});
    }

    return dayMenus;
}
