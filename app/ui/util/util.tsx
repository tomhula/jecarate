'use client'

import { createRoot, Root } from "react-dom/client"
import AlertBubble from "@/app/ui/util/alert-bubble"

export function showAlertBubble(level: "error" | "warning" | "success" | "info", message: string)
{
    const alertRoot = document.createElement("div")
    document.body.appendChild(alertRoot)
    const root = createRoot(alertRoot)
    root.render(<AlertBubble level={level} message={message} onClose={() => unmountRoot(root, alertRoot)}/>)
}

function unmountRoot(root: Root, container: HTMLElement)
{
    root.unmount()
    container.remove()
}

