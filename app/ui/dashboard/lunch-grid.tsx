'use client'

import dashboardStyles from './dashboard.module.css'
import LunchCard from "@/app/ui/dashboard/lunch-card"
import LoadingBubbles from "@/app/ui/util/loading-bubbles";
import CenterBox from "@/app/ui/util/center-box";
import {Rating} from "@/app/dashboard/page";

export default function LunchGrid({ratings}: { ratings: Rating[] | null })
{
    return (
        <>
            {ratings === null ? (
                <CenterBox>
                    <LoadingBubbles/>
                </CenterBox>
            ) : ratings.length === 0 ? (
                <CenterBox>
                    <p>Nebyly nalezeny žádné hodnocení</p>
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
