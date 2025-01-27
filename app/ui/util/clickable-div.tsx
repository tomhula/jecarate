'use client'

import React from "react";

export function ClickableDiv(props: { children: React.ReactNode, action: () => void })
{
    return (
        <div onClick={ props.action } className="cursor-pointer">
            { props.children }
        </div>
    )
}