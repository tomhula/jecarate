import React from 'react'
import styles from '../food-rating.module.css'

export function FoodFormQuestion(props: { children: React.ReactNode })
{
    return (
        <div className={styles.formQuestion}>
            {props.children}
        </div>
    )
}