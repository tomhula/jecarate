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
            <h3>{name}</h3>
            <p>Date: {date}</p>
            <p>Average Rating: {rating}</p>
        </div>
    )
}