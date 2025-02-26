'use client'

import { useEffect, useState } from 'react'
import { FoodOption } from '@/app/ui/food-rating/food-option'
import { FoodFormQuestion } from '@/app/ui/food-rating/food-question'
import { FoodFormQuestionAnswerContainer } from "@/app/ui/food-rating/form-answer-container"
import foodFormStyles from './food-rating.module.css'
import RatingSlider from "@/app/ui/food-rating/rating-slider"
import { authorize } from "@/app/index.client"
import { FormAnswer } from "@/app/lib/util"
import { DayMenu, MenuItem } from "@/app/lib/canteen/CanteenMenuParser"
import { showAlertBubble } from "@/app/ui/util/util"
import LoadingBubbles from "@/app/ui/util/loading-bubbles";


export default function FoodSelector()
{
    const [showForm, setShowForm] = useState(false)
    const [selectedId, setSelectedId] = useState<string>('')
    const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null) // To store fetched menu items as objects, initially null
    const [containsDessert, setContainsDessert] = useState(false);

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
        ration: 0,
        taste: 0,
        price: 0,
        temperature: 0,
        looks: 0,
        dessert: 0
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
                answers: answers,
                userToken: localStorage.getItem('token')
            })
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    showResponseMessage(response)
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
    }

    function showResponseMessage(response: Response)
    {
        if (!response.ok)
        {
            response.json().then(data =>
                {
                    const status = response.status
                    showAlertBubble("error", data.message)
                    if (status === 401 || status === 404)
                        setTimeout(() => window.location.href = "/login", 1000)
                }
            )
        }
    }

    return (
        <div className={'page-container'}>
            {menuItems != null ? (
                menuItems.length === 0 ? (
                    <div>No menu for today</div>
                ) : (
                    <div className={foodFormStyles.foodOptionsContainer}>
                        {/* Meals on the Same Line */}
                        <div className={foodFormStyles.foodOptions}>
                            {menuItems.map((item) => (
                                <FoodOption
                                    key={item.number}
                                    id={item.description}
                                    selectedId={selectedId}
                                    onClick={() => handleFoodOptionClick(item.description)}
                                >
                                    {item.description}
                                </FoodOption>
                            ))}
                        </div>

                        {/* Separation Line */}
                        <div className={foodFormStyles.separatorLine}></div>

                        {/* Soup Below the Line */}
                        {menuItems?.[0]?.soup && (
                            <div className={foodFormStyles.soupContainer}>
                                <FoodOption
                                    key={"soup"}
                                    id={menuItems[0].soup}
                                    selectedId={selectedId}
                                    onClick={() => handleFoodOptionClick(menuItems[0].soup)}
                                >
                                    {menuItems[0].soup}
                                </FoodOption>
                            </div>
                        )}
                    </div>
                )
            ) : (
                <LoadingBubbles />
            )}
            {/* Separation Line */}
            <div className={foodFormStyles.separatorLine}></div>

            {!showForm && (
                <div id="message" className={foodFormStyles.message}>
                    Choose a food
                </div>
            )}
            {showForm && (
                <form id="food-form">
                    {!containsDessert && (
                        <FoodFormQuestion>
                        <label className={foodFormStyles.dessertCheckboxContainer}>
                            Měl oběd také dezert?
                            <input
                                className={foodFormStyles.dessertCheckbox}
                                type="checkbox"
                                checked={containsDessert}
                                onChange={() => setContainsDessert(!containsDessert)}
                            />
                            <span className={foodFormStyles.customCheckbox}></span>
                        </label>
                        </FoodFormQuestion>
                        )}

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Byla porce uspokojivá?</label>
                        <RatingSlider labelMap={ratingLabelMap}
                                      onChange={val => chosenAnswers.ration = val}></RatingSlider>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Bylo jídlo chutné?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ratingLabelMap}
                                          onChange={val => chosenAnswers.taste = val}></RatingSlider>
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

                    {containsDessert && (
                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Byl dezert také chutný?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => chosenAnswers.dessert = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>
                    )}

                    <button type="button" onClick={ () => postAnswers(chosenAnswers) }
                            className={ foodFormStyles.submitButton }>Submit
                    </button>
                </form>
            ) }
        </div>
    )
}
