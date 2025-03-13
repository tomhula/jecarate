/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/data/canteen/DayMenu.kt
Translated to Typescript using ChatGPT: https://chatgpt.com/share/67bb0165-3770-800e-9e10-043b69e2e95b
https://chatgpt.com/share/67bb0519-cc20-800e-b44c-a8a5d8bf1749
##############################################################################################################################
*/

import {MenuItem} from "@/app/lib/canteen/MenuItem";

export class DayMenu implements Iterable<MenuItem>
{
    constructor(
        public day: Date,  // changed from string to Date
        public items: MenuItem[]
    )
    {
    }

    [Symbol.iterator](): Iterator<MenuItem>
    {
        return this.items.values();
    }

    static builder(day: Date): DayMenuBuilder
    {
        return new DayMenuBuilder(day);
    }
}

export class DayMenuBuilder
{
    private items: MenuItem[] = [];

    constructor(private day: Date)
    {
    }

    addMenuItem(menuItem: MenuItem): void
    {
        this.items.push(menuItem);
    }

    build(): DayMenu
    {
        return new DayMenu(this.day, this.items);
    }
}
