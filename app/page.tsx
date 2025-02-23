'use client'

import { redirect } from 'next/navigation'
import { authorize } from "@/app/index"
import { useEffect } from "react"
import Image from "next/image"
import styles from "@/app/ui/root.module.css"

export default function Page()
{
    useEffect(() =>
    {
        setTimeout(() => {
            if (localStorage.getItem('token') === null || !authorize())
                redirect('/login')

            redirect('/dashboard')
        }, 2000)
    }, []);
    
    return (
        <div className={styles.root}>
            <Image src="/jecarate-icon.png" width={741} height={474} alt="Microsoft Logo"
                   className={ styles.pulse }/>
        </div>
    )
}
