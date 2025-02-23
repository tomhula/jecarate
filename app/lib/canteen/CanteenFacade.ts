import {ICanteenWebClient} from "@/app/lib/icanteen-web-client";
import {Menu} from "@/app/lib/canteen/Menu";
import CanteenParser from "@/app/lib/canteen/CanteenParser";

const parser = new CanteenParser()

export async function getMenu(canteenClient: ICanteenWebClient): Promise<Menu>
{
    if (!await canteenClient.isLoggedIn())
        throw new Error("Not logged in")

    const menuHtml = await (await canteenClient.query("faces/secured/mobile.jsp")).text()
    const menuPage = parser.parse(menuHtml)

    return menuPage.menu
}

export async function getMenuUsernamePassword(username: string, password: string): Promise<Menu>
{
    const canteenClient = new ICanteenWebClient()
    const loginResult = await canteenClient.login({username, password});

    if (!loginResult)
    {
        throw new Error("Login failed: Invalid username or password");
    }
    
    return getMenu(canteenClient)
}
