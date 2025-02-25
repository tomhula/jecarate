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
    const maxRating = 3
    return (
        <div className={styles.lunchCard}>
            <h3 className={styles.lunchCardName}>{name}</h3>
            <div className={styles.lunchCardFieldName}>Date: <p>{date}</p></div>
            <div className={styles.lunchCardFieldName}>Rating: <p>{rating}</p></div>
            <div className={styles.ratingContainer}>
                <div className={styles.stars}>★★★</div>
                <div className={styles.starsFull} style={{width: `${(rating / maxRating) * 100}%`}}>★★★</div>
            </div>
        </div>
    )
}