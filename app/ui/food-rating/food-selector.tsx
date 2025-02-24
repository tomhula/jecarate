'use client'

import { useEffect, useState } from 'react'
import { FoodOption } from '@/app/ui/food-rating/food-option'
import { FoodFormQuestion } from '@/app/ui/food-rating/food-question'
import { FoodFormQuestionAnswerContainer } from "@/app/ui/food-rating/form-answer-container"
import foodFormStyles from './food-rating.module.css'
import RatingSlider from "@/app/ui/food-rating/rating-slider"
import { authorize } from "@/app"
import { FormAnswer } from "@/app/lib/util"
import { DayMenu, MenuItem } from "@/app/lib/canteen/CanteenMenuParser"
import { showAlertBubble } from "@/app/ui/util/util"

export default function FoodSelector()
{
    const [showForm, setShowForm] = useState(false)
    const [selectedId, setSelectedId] = useState<string>('')
    const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null) // To store fetched menu items as objects, initially null

    useEffect(() =>
    {
        if (!authorize())
        {
            window.location.href = '/login'
            return
        }

        fetch('/api/todays-menu')
            .then(response =>
            {
                if (!response.ok)
                {
                    return { items: [] }
                }
                return response.json()
            })
            .then((data: DayMenu) =>
            {
                setMenuItems(data.items) // Assumes the response includes { items: MenuItem[] }
            })
            .catch(error =>
            {
                console.error("Error fetching menu:", error)
            })
    }, [])

    const handleSelect = (id: string) =>
    {
        setSelectedId(id)
    }

    const handleFoodOptionClick = (id: string) =>
    {
        setShowForm(true)
        handleSelect(id)
    }

    const chosenAnswers: FormAnswer = {
        ration: null,
        taste: null,
        price: null,
        temperature: null,
        looks: null
    }

    function ratingLabelMap(rating: number)
    {
        switch (rating)
        {
            case 0:
                return "Určitě ne"
            case 1:
                return "Spíš ne"
            case 2:
                return "Ano"
            case 3:
                return "Určitě ano"
            default:
                return ""
        }
    }

    function postAnswers(answers: FormAnswer)
    {
        fetch('/api/food-ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                foodId: selectedId,
                answers: answers
            })
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error("Failed to submit food rating")
                }
                return response.json()
            })
            .then(data =>
            {
                showAlertBubble("success", "Food rating submitted!")
                setShowForm(false)
                setSelectedId('')
                setTimeout(() => window.location.href = "/dashboard", 1000)
            })
            .catch(_ =>
            {
                showAlertBubble("error", "Failed to submit food rating")
            })
    }

    return (
        <div className={ 'page-container' }>
            <div className={ foodFormStyles.foodOptions }>
                { menuItems != null ? (
                    menuItems.length == 0 ?
                        <div>No menu for today</div>
                        :
                        menuItems.map((item) => (
                            <FoodOption
                                key={ item.number }
                                id={ item.description }
                                selectedId={ selectedId }
                                onClick={ () => handleFoodOptionClick(item.description) }
                            >
                                { item.description }
                            </FoodOption>
                        ))
                ) : (
                    <div>Loading menu...</div>
                ) }
            </div>

            { !showForm && (
                <div id="message" className={ foodFormStyles.message }>
                    Choose a food
                </div>
            )
            }

            { showForm && (
                <form id="food-form">
                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Byla porce uspokojivá?</label>
                        <RatingSlider labelMap={ ratingLabelMap }
                                      onChange={ val => chosenAnswers.ration = val }></RatingSlider>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Bylo jídlo chutné?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => chosenAnswers.taste = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Byli by jste ochotni, si za toto jídlo
                            připlatit?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => chosenAnswers.price = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Mělo jídlo správnou teplotu?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => chosenAnswers.temperature = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Vypadala prezentace jídla chutně ?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => chosenAnswers.looks = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <button type="button" onClick={ () => postAnswers(chosenAnswers) }
                            className={ foodFormStyles.submitButton }>Submit
                    </button>
                </form>
            ) }
        </div>
    )
}
