import React from 'react'
import foodFormStyles from '../food-rating.module.css'
import utilStyles from '../util.module.css'


export function FoodFormQuestion(props: { children: React.ReactNode })
{
    return (
        <div className={`${foodFormStyles.formQuestion} ${utilStyles.centeredContainerVertical}`}>
            {props.children}
        </div>
    )
}