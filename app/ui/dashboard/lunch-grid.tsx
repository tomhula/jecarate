'use client'

import dashboardStyles from './dashboard.module.css'
import LunchCard from "@/app/ui/dashboard/lunch-card"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { authorize } from "@/app";

export default function LunchGrid()
{
    const [allRatings, setAllRatings] = useState<{ name: string, rating: number, date: string }[]>([])

    useEffect(() =>
    {
        if (!authorize())
            window.location.href = '/login'
        getAllStates(setAllRatings)
    }, [])

    function getAllStates(setAllRatings: Dispatch<SetStateAction<{ name: string, rating : number, date: string }[]>>)
    {
        fetch("/api/food-ratings")
            .then((response) => response.json())
            .then((json) => json as { rating_id: number, food_name: string, rating: number, lunch_date: string }[])
            .then((ratings) =>
            {
                const formattedRatings = ratings
                    .map((row) => (
                        {
                            name: row.food_name,
                            rating: row.rating,
                            date: new Date(row.lunch_date).toLocaleDateString('en-GB').split('/').join('.') // Format date as DD.MM.YYYY
                        }
                    )
                )
                setAllRatings(formattedRatings)
            })
            .catch((error) => console.error("Error fetching data:", error))
    }

    return (
        <div className={ dashboardStyles.lunchGrid }>
            { allRatings.length == 0 ? (
                <div>Loading...</div>
            ) : (
                allRatings.map((row) => <LunchCard key={ row.date + row.name } name={ row.name } rating={ row.rating }
                                                   date={ row.date }/>)
            ) }
        </div>
    )
}