'use client'

import LunchGrid from "@/app/ui/dashboard/lunch-grid"
import dashboardStyles from "@/app/ui/dashboard/dashboard.module.css"
import {useEffect, useState} from "react"
import {authorize} from "@/app/index.client"

// Define types for better code organization
export type Rating = {
    name: string
    rating: number
    date: string
}

type RatingApiResponse = {
    rating_id: number
    food_name: string
    rating: number
    lunch_date: string
}

export default function Dashboard()
{
    const [allRatings, setAllRatings] = useState<Rating[] | null>(null) // null means not loaded yet
    const [filteredRatings, setFilteredRatings] = useState<Rating[] | null>(null) // null means not loaded yet
    const [searchName, setSearchName] = useState<string | null>(null)
    const [searchDate, setSearchDate] = useState<string | null>(null)

    // Initial authentication and data loading
    useEffect(() =>
    {
        if (!authorize())
        {
            window.location.href = '/login'
            return
        }

        fetchAllRatings()
    }, [])

    // Filter ratings whenever filter criteria or allRatings change
    useEffect(() =>
    {
        applyFilters()
    }, [allRatings, searchName, searchDate])

    // Fetch ratings from API
    const fetchAllRatings = () =>
    {
        fetch("/api/food-ratings")
            .then((response) => response.json())
            .then((json: RatingApiResponse[]) =>
            {
                const formattedRatings = json.map((row) => ({
                    name: row.food_name,
                    rating: parseFloat(row.rating.toFixed(1)),
                    date: formatApiDateToDisplayFormat(row.lunch_date)
                }))

                // Empty array if no data, but not null since we've loaded data
                setAllRatings(formattedRatings)
            })
            .catch((error) =>
            {
                console.error("Error fetching data:", error)
                setAllRatings([]) // Empty array on error, since we attempted to load
            })
    }

    // Format date from API to display format (MM/DD/YYYY)
    const formatApiDateToDisplayFormat = (dateString: string): string =>
    {
        return new Date(dateString).toLocaleDateString('en-US')
    }

    // Format input date (yyyy-MM-dd) to display format (MM/DD/YYYY)
    const formatInputDateToDisplayFormat = (dateString: string): string =>
    {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US')
    }

    // Apply current filters to the ratings
    const applyFilters = () =>
    {
        // If data is still loading, keep filteredRatings as null
        if (allRatings === null)
        {
            setFilteredRatings(null)
            return
        }

        // If no filter criteria, return all ratings (could be empty array)
        if (!searchName && !searchDate)
        {
            setFilteredRatings(allRatings)
            return
        }

        // Apply name filter
        if (searchName)
        {
            const filtered = allRatings.filter(rating =>
                rating.name.toLowerCase().includes(searchName.toLowerCase()))
            setFilteredRatings(filtered) // Could be empty array if no matches
        }
        // Apply date filter
        else if (searchDate)
        {
            const filtered = allRatings.filter(rating =>
                rating.date === searchDate)
            setFilteredRatings(filtered) // Could be empty array if no matches
        }
    }

    const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const inputName = event.target.value || null
        setSearchName(inputName)
        setSearchDate(null) // Clear other filter
    }

    const handleSearchDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const inputDate = event.target.value

        if (inputDate)
        {
            setSearchDate(formatInputDateToDisplayFormat(inputDate))
        }
        else
        {
            setSearchDate(null)
        }

        setSearchName(null) // Clear other filter
    }

    return (
        <>
            <div className={dashboardStyles.dashboardHeader}>Katalog objedů</div>
            <button
                className={dashboardStyles.rateButton}
                onClick={() => window.location.href = '/food-rating'}
            >
                Ohodnotit dnešní objed
            </button>
            <div className={dashboardStyles.searchContainer}>
                <input
                    type="text"
                    placeholder="Hledat podle názvu.."
                    id="searchName"
                    value={searchName || ''}
                    onChange={handleSearchNameChange}
                />
                <input
                    type="date"
                    id="searchDate"
                    value={searchDate ? convertDisplayDateToInputFormat(searchDate) : ''}
                    onChange={handleSearchDateChange}
                />
            </div>
            <LunchGrid ratings={filteredRatings}/>
        </>
    )
}

// Helper function to convert MM/DD/YYYY to yyyy-MM-dd for the date input
function convertDisplayDateToInputFormat(displayDate: string): string
{
    const date = new Date(displayDate)
    return date.toISOString().split('T')[0] // Returns YYYY-MM-DD format
}
