'use client'

import { redirect } from 'next/navigation'
import { authorize } from "@/app/index";

export default function Page()
{
    if (authorize())
        redirect('/dashboard')

    redirect('/login')
}
