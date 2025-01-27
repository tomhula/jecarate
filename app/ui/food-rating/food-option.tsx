'use client'

import styles from '../food-rating.module.css'

export function FoodOption(props: { children: string; onClick: () => void })
{
    return (
        <div className={styles.foodOption} onClick={props.onClick}>
            {props.children}
        </div>
    )
}
