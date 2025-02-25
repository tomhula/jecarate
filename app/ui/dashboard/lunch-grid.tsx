'use client'

import dashboardStyles from './dashboard.module.css'
import LunchCard from "@/app/ui/dashboard/lunch-card"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { authorize } from "@/app/index.client";
import LoadingBubbles from "@/app/ui/util/loading-bubbles";
import CenterBox from "@/app/ui/util/center-box";

export default function LunchGrid()
{
    const [allRatings, setAllRatings] = useState<{ name: string, rating: number, date: string }[] | null>([])

    useEffect(() =>
    {
        if (!authorize())
            window.location.href = '/login'
        getAllStates(setAllRatings)
    }, [])

    function getAllStates(setAllRatings: Dispatch<SetStateAction<{
        name: string,
        rating: number,
        date: string
    }[] | null>>)
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
                                rating: parseFloat(row.rating.toFixed(1)),
                                date: new Date(row.lunch_date).toLocaleDateString('en-GB').split('/').join('.') // Format date as DD.MM.YYYY
                            }
                        )
                    )
                setAllRatings(formattedRatings.length > 0 ? formattedRatings : null)
            })
            .catch((error) => console.error("Error fetching data:", error))
    }

    return (
        <>
            { allRatings === null ? (
                <CenterBox>
                    <p>Nebyly nalezeny žádné hodnocení</p>
                </CenterBox>
            ) : allRatings.length === 0 ? (
                <CenterBox>
                    <LoadingBubbles/>
                </CenterBox>
            ) : (
                <div className={ dashboardStyles.lunchGrid }>
                    { allRatings.map((row) => <LunchCard key={ row.date + "_" + row.name } name={ row.name }
                                                         rating={ row.rating }
                                                         date={ row.date }/>) }
                </div>
            ) }
        </>
    )
}