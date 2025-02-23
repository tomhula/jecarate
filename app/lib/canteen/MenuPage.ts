/*
##############################################################################################################################
CODE FROM: https://github.com/tomhula/JecnaAPI/blob/main/src/main/kotlin/me/tomasan7/jecnaapi/data/canteen/MenuPage.kt
Translated to Typescript using ChatGPT: https://chatgpt.com/share/67bb0165-3770-800e-9e10-043b69e2e95b
##############################################################################################################################
*/


import {Menu} from "@/app/lib/canteen/Menu";

export class MenuPage
{
    constructor(
        public menu: Menu,
        public credit: number
    )
    {
    }
}
