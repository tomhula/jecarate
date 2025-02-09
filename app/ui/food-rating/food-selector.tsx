'use client'

import { useState } from 'react'
import { FoodOption } from '@/app/ui/food-rating/food-option'
import { FoodFormQuestion } from '@/app/ui/food-rating/food-question'
import { ClickableDiv } from "@/app/ui/util/clickable-div"
import {FoodFormQuestionAnswerContainer} from "@/app/ui/food-rating/form-answer-container";
import foodFormStyles from './food-rating.module.css'
import RatingSlider from "@/app/ui/food-rating/rating-slider";

export default function FoodSelector()
{
    const [showForm, setShowForm] = useState(false)

    const handleFoodOptionClick = () => { setShowForm(true) }

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
                return "Určitě ne";
            case 1:
                return "Spíš ne";
            case 2:
                return "Ano";
            case 3:
                return "Určitě ano";
            default:
                return "";
        }
    }

    return (
        <div className={'page-container'}>
            <div className={foodFormStyles.foodOptions}>
                <FoodOption onClick={() => handleFoodOptionClick()}>Pizza</FoodOption>
                <FoodOption onClick={() => handleFoodOptionClick()}>Burger</FoodOption>
            </div>

            { !showForm && (
                    <div id="message" className={foodFormStyles.message}>
                        Choose a food
                    </div>
                )
            }

            { showForm && (
                <form id="food-form" method={"post"}>
                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Byla porce uspokojivá?</label>
                            <RatingSlider labelMap={ratingLabelMap} onChange={ val => chosenAnswers.ration = val }></RatingSlider>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Bylo jídlo chutné?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ratingLabelMap} onChange={ val => chosenAnswers.taste = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Byli by jste ochotni, si za toto jídlo připlatit?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ratingLabelMap} onChange={ val => chosenAnswers.price = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Mělo jídlo správnou teplotu?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ratingLabelMap} onChange={ val => chosenAnswers.temperature = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Vypadala prezentace jídla chutně ?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ratingLabelMap} onChange={ val => chosenAnswers.looks = val }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}
