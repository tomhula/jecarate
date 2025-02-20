'use client'
import dashboardStyles from './dashboard.module.css'
import LunchCard from "@/app/ui/dashboard/lunch-card";

export default function LunchGrid()
{
    return (
        <div className={dashboardStyles.lunchGrid}>
            <LunchCard name="Spaghetti Bolognese" date="2025-02-20" rating={4.3}/>
            <LunchCard name="Grilled Chicken Salad" date="2025-02-19" rating={3.8}/>
            <LunchCard name="Vegetable Stir Fry" date="2025-02-18" rating={4.1}/>
            <LunchCard name="Beef Stroganoff" date="2025-02-17" rating={4.5}/>
        </div>
    )
}