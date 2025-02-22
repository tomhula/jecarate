'use client'
import styles from './dashboard.module.css'

interface LunchCardProps
{
    name: string,
    date: string,
    rating: number,
}

export default function LunchCard({name, date, rating}: LunchCardProps)
{
    return (
        <div className={styles.lunchCard}>
            <h3 className={styles.lunchCardName}>{name}</h3>
            <div className={styles.lunchCardFieldName}>Date: <p>{date}</p></div>
            <div className={styles.lunchCardFieldName}>Rating: <p>{rating}</p></div>
        </div>
    )
}