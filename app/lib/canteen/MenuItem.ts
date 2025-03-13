/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/data/canteen/MenuItem.kt
Translated to Typescript using ChatGPT: https://chatgpt.com/share/67bb0165-3770-800e-9e10-043b69e2e95b
##############################################################################################################################
*/

import {ItemDescription} from "@/app/lib/canteen/ItemDescription";

export interface MenuItem {
    number: number;
    description?: ItemDescription;
    allergens?: string[];
    price: number;
    isEnabled: boolean;
    isOrdered: boolean;
    isInExchange: boolean;
    orderPath: string;
    putOnExchangePath?: string;
}
