'use client'

import LunchGrid from "@/app/ui/dashboard/lunch-grid"
import dashboardStyles from "@/app/ui/dashboard/dashboard.module.css"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {authorize} from "@/app/index.client";

export default function Dashboard()
{
    const [allRatings, setAllRatings] = useState<{ name: string, rating: number, date: string }[] | null>([])
    const [filteredRatings, setFilteredRatings] = useState<{ name: string, rating: number, date: string }[] | null>([])
    const [searchName, setSearchName] = useState<string | null>(null)
    const [searchDate, setSearchDate] = useState<string | null>(null)


    useEffect(() =>
    {
        if (searchName)
        {
            const filtered = allRatings?.filter(rating =>
                rating.name.toLowerCase().includes(searchName.toLowerCase())) || null;
            setFilteredRatings(filtered);
        } else if (searchDate)
        {
            const filtered = allRatings?.filter(rating =>
                rating.date === searchDate) || null;
            setFilteredRatings(filtered);
        } else
        {
            setFilteredRatings(allRatings);
        }
    }, [allRatings]);

    function handleSearchNameChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        const inputName = event.target.value;
        setSearchName(inputName || null);
        setSearchDate(null);

        if (inputName)
        {
            const filtered = allRatings?.filter(rating => rating.name.toLowerCase().includes(inputName.toLowerCase())) || null;
            setFilteredRatings(filtered);
        }
        else
        {
            setFilteredRatings(allRatings);
        }
    }

    function handleSearchDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        const inputDate = event.target.value; // In yyyy-MM-dd format
        setSearchDate(inputDate || null);
        setSearchName(null);

        if (inputDate) {
            // Convert yyyy-MM-dd to dd.MM.yyyy for comparison
            const parts = inputDate.split('-');
            const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`; // Converts to dd.MM.yyyy

            const filtered = allRatings?.filter(rating => rating.date === formattedDate) || null;
            console.log(filtered);
            setFilteredRatings(filtered);
        } else {
            setFilteredRatings(allRatings);
        }
    }

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
            <div className={dashboardStyles.dashboardHeader}>Katalog objedů</div>
            <button className={dashboardStyles.rateButton} onClick={() => window.location.href = '/food-rating'}>Ohodnotit dnešní objed</button>
            <div className={dashboardStyles.searchContainer}>
                <input type="text" placeholder="Hledat podle názvu.." id="search-name" value={searchName || ''}
                       onChange={handleSearchNameChange}/>
                <input type="date" id="search-date" value={searchDate || ''} onChange={handleSearchDateChange}/>
            </div>
            <LunchGrid ratings={filteredRatings}/>
        </>
    )
}
