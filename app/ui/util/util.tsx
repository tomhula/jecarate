'use client'

import { createRoot, Root } from "react-dom/client"
import AlertBubble, { AlertBubbleProps } from "@/app/ui/util/alert-bubble"

export function showAlertBubble(level: "error" | "warning" | "success" | "info", message: string): AlertBubbleProps
{
    const alertRoot = document.createElement("div")
    document.body.appendChild(alertRoot)

    const root = createRoot(alertRoot)
    const alertBubble = <AlertBubble level={level} message={message} onClose={() => unmountRoot(root, alertRoot)}/>
    root.render(alertBubble)

    return { level, message, onClose: () => unmountRoot(root, alertRoot) }
}

function unmountRoot(root: Root, container: HTMLElement)
{
    root.unmount()
    container.remove()
}

