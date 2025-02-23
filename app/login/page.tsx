'use client'

import LoginForm from "@/app/ui/login/login-form";
import { useEffect } from "react";
import { showAlertBubble } from "@/app/ui/util/util";

export default function Page()
{
    useEffect(() =>
    {
        if (document.referrer.includes("/food-rating") || document.referrer.includes("/dashboard"))
            showAlertBubble("error", "You need to be logged in to access this page.");
    }, []
    );

    return <LoginForm postUrl={ "/api/login" }/>
}
