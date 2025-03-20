'use client'

import { useEffect, useState } from "react"
import { getRatingsByPattern } from "@/app/api/statistics/action"
import dashboardStyles from "@/app/ui/dashboard/dashboard.module.css"

type StatisticProps = {
    question: string
    regex: string[]
}

export default function Statistic({ question, regex }: StatisticProps) {
    const [ratings, setRatings] = useState<any[] | null>(null)

    useEffect(() => {
        async function fetchRatings() {
            try {
                const result = await getRatingsByPattern(regex)
                setRatings(result)
            } catch (error) {
                console.error("Error fetching statistics:", error)
                setRatings([])
            }
        }

        fetchRatings()
    }, [regex])

    // Calculate the average rating per category (meat type, etc.)
    const calculateAverageScores = () => {
        if (!ratings || ratings.length === 0) return {}

        const categoryAverages: { [key: string]: number } = {} // Stores averages per category
        const categoryCounts: { [key: string]: number } = {} // Stores number of ratings per category

        ratings.forEach(({ food_name, rating }) => {
            // Find which category the food belongs to
            const category = regex.find(pattern => food_name.toLowerCase().includes(pattern.toLowerCase()))

            if (category) {
                if (!categoryAverages[category]) {
                    categoryAverages[category] = 0
                    categoryCounts[category] = 0
                }
                categoryAverages[category] += rating
                categoryCounts[category] += 1
            }
        })

        // Compute actual averages
        Object.keys(categoryAverages).forEach(category => {
            categoryAverages[category] = Number((categoryAverages[category] / categoryCounts[category]).toFixed(1))
        })
        return categoryAverages
    }
    const categoryScores = calculateAverageScores()
    // Find the highest-rated category
    const highestRating = Math.max(...Object.values(categoryScores))

    return (
        <div className={dashboardStyles.statisticCard}>
            <h3 className={dashboardStyles.question}>{question}</h3>
            {ratings === null ? (
                <p className="text-gray-500">Loading...</p>
            ) : Object.keys(categoryScores).length > 0 ? (
                <ul className={dashboardStyles.ratingsList}>
                    {Object.entries(categoryScores).map(([category, avgRating]) => (
                        <li key={category} className={`${dashboardStyles.ratingItem} 
                        ${avgRating === highestRating ? dashboardStyles.highlighted : ""}`}>
                            <span>{category}</span>
                            <span className={dashboardStyles.ratingValue}>{avgRating}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No matching meals found.</p>
            )}
        </div>
    )
}
