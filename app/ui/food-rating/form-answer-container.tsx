import React from 'react'
import utilStyles from '../util.module.css'
import foodFormStyles from '../food-rating.module.css'

export function FoodFormQuestionAnswerContainer(props: { children: React.ReactNode })
{
    return (
        <div className={`${foodFormStyles.foodFormQuestionAnswerContainer} ${utilStyles.buttonContainer}`}>
            {props.children}
        </div>
    )
}