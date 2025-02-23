'use client'

import { redirect } from 'next/navigation'
import { authorize } from "@/app/index";
import { useEffect } from "react";

export default function Page()
{
    useEffect(() =>
    {
        if (!authorize())
            redirect('/login')
        
        redirect('/dashboard')
    }, []);
    
}
