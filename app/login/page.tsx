'use client'

import LoginForm from "@/app/ui/login/login-form";
import { useEffect } from "react";
import { showAlertBubble } from "@/app/ui/util/util";

export default function Page()
{
    useEffect(() =>
    {
        if (document.referrer.includes("/food-rating") || document.referrer.includes("/dashboard"))
            showAlertBubble("error", "Pro tuto stránku musíte být přihlášen.");
    }, []
    );

    return <LoginForm postUrl={ "/api/login" }/>
}
