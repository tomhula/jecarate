'use client'

import React from "react";
import styles from '../util.module.css'

export function ClickableDiv(props: { children: React.ReactNode, action: () => void })
{
    return (
        <div onClick={ props.action } className={`${styles.cursorPointer} ${styles.roundDivButton}`}>
            { props.children }
        </div>
    )
}