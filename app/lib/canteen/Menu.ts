/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/data/canteen/Menu.kt
Translated to Typescript using ChatGPT: https://chatgpt.com/share/67bb0165-3770-800e-9e10-043b69e2e95b
https://chatgpt.com/share/67bb0519-cc20-800e-b44c-a8a5d8bf1749
##############################################################################################################################
*/

import {DayMenu} from "@/app/lib/canteen/DayMenu";

export class Menu implements Iterable<DayMenu>
{
    private menu: Map<Date, DayMenu>;  // changed from Map<string, DayMenu> to Map<Date, DayMenu>

    constructor(menu: Map<Date, DayMenu>)
    {
        this.menu = new Map(menu);
    }

    get days(): Set<Date>
    {  // changed from Set<string> to Set<Date>
        return new Set(this.menu.keys());
    }

    get dayMenus(): Set<DayMenu>
    {
        return new Set(this.menu.values());
    }

    getDayMenu(day: Date): DayMenu | undefined
    {  // changed parameter to Date
        return this.menu.get(day);
    }

    get(day: Date): DayMenu | undefined
    {  // changed parameter to Date
        return this.getDayMenu(day);
    }

    replace(day: Date, dayMenu: DayMenu): void
    {  // changed parameter to Date
        this.menu.set(day, dayMenu);
    }

    [Symbol.iterator](): Iterator<DayMenu>
    {
        return this.dayMenus.values();
    }

    static builder(): MenuBuilder
    {
        return new MenuBuilder();
    }
}

export class MenuBuilder
{
    private menu: Map<Date, DayMenu> = new Map();  // changed from Map<string, DayMenu> to Map<Date, DayMenu>

    addDayMenu(day: Date, dayMenu: DayMenu): void
    {  // changed parameter to Date
        this.menu.set(day, dayMenu);
    }

    build(): Menu
    {
        return new Menu(this.menu);
    }
}
