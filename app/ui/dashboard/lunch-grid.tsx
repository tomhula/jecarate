'use client'

import dashboardStyles from './dashboard.module.css'
import LunchCard from "@/app/ui/dashboard/lunch-card"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { authorize } from "@/app/index.client";
import LoadingBubbles from "@/app/ui/util/loading-bubbles";
import CenterBox from "@/app/ui/util/center-box";

export default function LunchGrid({ratings}: { ratings: { name: string, rating: number, date: string }[] | null })
{
    return (
        <>
            {ratings === null ? (
                <CenterBox>
                    <p>Nebyly nalezeny žádné hodnocení</p>
                </CenterBox>
            ) : ratings.length === 0 ? (
                <CenterBox>
                    <LoadingBubbles/>
                </CenterBox>
            ) : (
                <div className={dashboardStyles.lunchGrid}>
                    {ratings.map((row) => <LunchCard key={row.date + "_" + row.name} name={row.name}
                                                     rating={row.rating}
                                                     date={row.date}/>)}
                </div>
            )}
        </>
    )
}
