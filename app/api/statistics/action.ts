'use server'

import { findRatingsByPattern } from "@/app/api/food-ratings/util"

export async function getRatingsByPattern(patterns: string[]) {
    try {
        const data = await findRatingsByPattern(patterns)

        // Ensure plain objects (avoid sending database-specific objects)
        return data.map(row => ({
            food_name: row.food_name,
            rating: row.rating,
            lunch_date: row.lunch_date,
            ration: row.ration,
            taste: row.taste,
            price: row.price,
            temperature: row.temperature,
            looks: row.looks
        }))
    } catch (error) {
        console.error("Database error:", error)
        return []
    }
}
