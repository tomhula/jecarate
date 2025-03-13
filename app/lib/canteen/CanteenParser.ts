/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/parser/parsers/HtmlCanteenParserImpl.kt
Translated to Typescript using ChatGPT: https://chatgpt.com/share/67bb0384-aaa8-800e-b218-96d6e8d37896
##############################################################################################################################
*/

import {JSDOM} from "jsdom";
import {MenuPage} from "./MenuPage";
import {MenuBuilder} from "@/app/lib/canteen/Menu";
import {ParseException} from "@/app/lib/canteen/ParseException";
import {DayMenu, DayMenuBuilder} from "@/app/lib/canteen/DayMenu";
import {OrderResponse} from "@/app/lib/canteen/OrderResponse";
import {MenuItem} from "@/app/lib/canteen/MenuItem";
import {ItemDescription} from "@/app/lib/canteen/ItemDescription";


const DATE_FORMAT = "dd.MM.yyyy";
const DATE_REGEX = /\d{2}\.\d{2}\.\d{4}/;
const ITEM_DESCRIPTION_REGEX = /^(.*?), {2};(.*)/;

class HtmlCanteenParserImpl
{
    parse(html: string): MenuPage
    {
        try
        {
            const menuBuilder = new MenuBuilder();

            const dom = new JSDOM(html);
            const document = dom.window.document;
            const formEles = document.querySelectorAll("#mainContext > table > tbody > tr > td > form");

            formEles.forEach(formEle =>
            {
                const dayMenu = this.parseDayMenuElement(formEle);
                menuBuilder.addDayMenu(dayMenu.day, dayMenu);
            });

            const credit = this.parseCreditText(this.selectFirstOrThrow(document, "#Kredit").textContent || "");

            return new MenuPage(menuBuilder.build(), credit);
        } catch (e)
        {
            throw new ParseException("Failed to parse canteen.", e instanceof Error ? e : undefined);
        }
    }

    parseDayMenu(html: string): DayMenu
    {
        const element = new JSDOM(html).window.document.body;
        return this.parseDayMenuElement(element);
    }

    parseOrderResponse(orderResponseHtml: string): OrderResponse
    {
        const document = new JSDOM(orderResponseHtml).window.document;

        const creditEle = this.selectFirstOrThrow(document, "#Kredit");
        const timeEle = this.selectFirstOrThrow(document, "#time");

        const credit = this.parseCreditText(creditEle.textContent || "");
        const time = parseInt(timeEle.textContent || "0", 10);

        return new OrderResponse(credit, time);
    }

    parseCreditText(creditEleText: string): number
    {
        return parseFloat(
            creditEleText
                .trim()
                .replace(" Kč", "")
                .replace(',', '.')
                .replace(/\s+/g, "")
        );
    }

    private parseDayMenuElement(dayMenuEle: Element): DayMenu
    {
        const dayTitle = this.selectFirstOrThrow(dayMenuEle, ".jidelnicekTop").textContent || "";
        const dayStr = DATE_REGEX.exec(dayTitle)?.[0];
        if (!dayStr) throw new ParseException("Failed to parse day date.");
        const day = new Date(dayStr.split(".").reverse().join("-")); // Parse as ISO date string

        const dayMenuBuilder = new DayMenuBuilder(day);

        const menuItemEles = dayMenuEle.querySelectorAll(".jidelnicekMain > .jidelnicekItem");

        menuItemEles.forEach(menuItemEle =>
        {
            dayMenuBuilder.addMenuItem(this.parseMenuItem(menuItemEle));
        });

        return dayMenuBuilder.build();
    }

    private parseMenuItem(menuItemEle: Element): MenuItem
    {
        const orderButtonEle = this.selectFirstOrThrow(menuItemEle, ".jidWrapLeft > a");
        const foodNameEle = this.selectFirstOrThrow(menuItemEle, ".jidWrapCenter");
        const itemDescriptionStr = foodNameEle.childNodes[0]?.textContent?.trim() || "";
        const numberText = this.selectFirstOrThrow(orderButtonEle, ".smallBoldTitle.button-link-align");
        const number = parseInt(numberText.textContent?.replace("Oběd ", "") || "0", 10);

        const itemDescription = itemDescriptionStr
            ? this.parseItemDescription(itemDescriptionStr)
            : undefined;

        const allergens = Array.from(menuItemEle.querySelectorAll(".textGrey > .textGrey"))
            .map(el => this.rawText(el.getAttribute("title") || ""));

        const onclick = orderButtonEle.getAttribute("onclick") || "";

        const putOnExchangeButtonEle = Array.from(menuItemEle.querySelectorAll(".input-group .allElements"))
            .find(el => el.textContent?.match(/ks (?:z|do) burzy/));

        const putOnExchangeOnClick = putOnExchangeButtonEle?.getAttribute("onclick");

        return {
            number,
            description: itemDescription,
            allergens,
            price: this.parseCreditText(this.selectFirstOrThrow(orderButtonEle, ".important.warning.button-link-align").textContent || ""),
            isEnabled: !orderButtonEle.classList.contains("disabled"),
            isOrdered: orderButtonEle.querySelector(".fa.fa-check.fa-2x") !== null,
            isInExchange: putOnExchangeButtonEle?.textContent === "z burzy <",
            orderPath: onclick.slice(90, onclick.length - 29),
            putOnExchangePath: putOnExchangeOnClick?.slice(17, putOnExchangeOnClick.length - 28)
        };
    }

    private parseItemDescription(itemDescriptionStr: string): ItemDescription
    {
        const match = ITEM_DESCRIPTION_REGEX.exec(itemDescriptionStr);
        console.log(itemDescriptionStr)
        if (!match) return {rest: itemDescriptionStr};

        const soup = match[1];
        const rest = match[2];
        return {soup: soup, rest: rest || ""};
    }

    private rawText(html: string): string
    {
        const doc = new JSDOM(html).window.document;
        return doc.body.textContent || "";
    }

    private selectFirstOrThrow(document: ParentNode, selector: string): Element
    {
        const element = document.querySelector(selector);
        if (!element) throw new ParseException(`Element not found: ${selector}`);
        return element;
    }
}

export default HtmlCanteenParserImpl;
