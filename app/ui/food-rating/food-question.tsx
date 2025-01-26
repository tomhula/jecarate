import React from 'react'

export function FoodFormQuestion(props: { children: React.ReactNode })
{
    return (
        <div className="form-question">
            {props.children}
        </div>
    )
}