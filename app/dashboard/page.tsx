'use client'

import LunchGrid from "@/app/ui/dashboard/lunch-grid"
import dashboardStyles from "@/app/ui/dashboard/dashboard.module.css"

export default function Dashboard()
{
    return (
        <>
            <div className={dashboardStyles.dashboardHeader}>Katalog objedů</div>
            <button className={dashboardStyles.rateButton} onClick={() => window.location.href = '/food-rating'}>Ohodnotit dnešní objed</button>
            <div className={dashboardStyles.searchContainer}>
                <input type="text" placeholder="Hledat podle názvu.." id="search-name"/>
                <input type="date" id="search-date"/>
            </div>
            <LunchGrid/>
        </>
    )
}
