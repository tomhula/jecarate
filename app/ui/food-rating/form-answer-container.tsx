import React from 'react'
import utilStyles from '../util.module.css'

export function FoodFormQuestionAnswerContainer(props: { children: React.ReactNode })
{
    return (
        <div className={utilStyles.buttonContainer}>
            {props.children}
        </div>
    )
}