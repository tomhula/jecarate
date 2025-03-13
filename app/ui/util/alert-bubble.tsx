'use client'

import styles from "./util.module.css"
import { useEffect, useRef, useState } from "react"

export interface AlertBubbleProps
{
    level: "error" | "warning" | "info" | "success"
    message: string
    onClose: () => void
}

export default function AlertBubble(bubbleProps: AlertBubbleProps)
{
    const bubbleRef = useRef<HTMLDivElement>(null)
    let bubbleColor = ""
    const [isFadingOut, setIsFadingOut] = useState(false)

    switch (bubbleProps.level)
    {
        case "error":
            bubbleColor = "bg-red-100 text-red-700"
            break
        case "warning":
            bubbleColor = "bg-yellow-100 text-yellow-700"
            break
        case "info":
            bubbleColor = "bg-blue-100 text-blue-700"
            break
        case "success":
            bubbleColor = "bg-green-100 text-green-700"
            break
    }

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            setIsFadingOut(true)
            setTimeout(() => bubbleProps.onClose(), 700)

        }, 15000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div ref={bubbleRef} className={`${styles.alertBubble} ${bubbleColor} ${isFadingOut ? styles.fadeOut : ""}`}>
            <p className="text-center text-lg font-semibold">
                {bubbleProps.message}
            </p>
            <button className={`${styles.alertBubbleXMark} ${bubbleColor}`} onClick={() => {
                setIsFadingOut(true)
                setTimeout(() => bubbleProps.onClose(), 700)
            }}>✖</button>
        </div>
    )
}