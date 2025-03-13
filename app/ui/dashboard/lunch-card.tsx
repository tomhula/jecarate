'use client'
import { useState } from 'react'
import styles from './dashboard.module.css'

interface LunchCardProps {
    name: string
    date: string
    rating: number
    ration: number
    taste: number
    price: number
    temperature: number
    looks: number
}

export default function LunchCard({ name, date, rating, ration, taste, price, temperature, looks }: LunchCardProps) {
    const [showPopup, setShowPopup] = useState(false)
    const maxRating = 3

    const renderStarRating = (value: number) => (
        <div className={styles.ratingContainer}>
            <div className={styles.stars}>★★★</div>
            <div className={styles.starsFull} style={{ width: `${(value / maxRating) * 100}%` }}>
                ★★★
            </div>
        </div>
    )

    return (
        <>
            <div className={styles.lunchCard} onClick={() => setShowPopup(true)}>
                <h3 className={styles.lunchCardName}>{name}</h3>
                <div className={styles.lunchCardFieldName}>
                    Datum: <p>{new Date(date).toLocaleDateString('cs-CZ')}</p>
                </div>
                <div className={styles.lunchCardFieldName}>
                    Hodnocení: <p>{rating}</p>
                </div>
                {renderStarRating(rating)}
            </div>

            {showPopup && (
                <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
                    <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                        <h2>Detail hodnocení</h2>
                        <p><strong>Název jídla:</strong> {name}</p>
                        <p><strong>Datum:</strong> {new Date(date).toLocaleDateString('cs-CZ')}</p>
                        <p><strong>Celkové hodnocení</strong></p>
                        {renderStarRating(rating)}
                        <hr />
                        <div>
                            <p><strong>Porce:</strong></p>
                            {renderStarRating(ration)}
                        </div>
                        <hr />
                        <div>
                            <p><strong>Chuť:</strong></p>
                            {renderStarRating(taste)}
                        </div>
                        <hr />
                        <div>
                            <p><strong>Cena:</strong></p>
                            {renderStarRating(price)}
                        </div>
                        <hr />
                        <div>
                            <p><strong>Teplota:</strong></p>
                            {renderStarRating(temperature)}
                        </div>
                        <hr />
                        <div>
                            <p><strong>Vzhled:</strong></p>
                            {renderStarRating(looks)}
                        </div>
                        <button onClick={() => setShowPopup(false)}>Zavřít</button>
                    </div>
                </div>
            )}
        </>
    )
}