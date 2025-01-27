'use client'

import { useState } from 'react'
import { FoodOption } from '@/app/ui/food-rating/food-option'
import { FoodFormQuestion } from '@/app/ui/food-rating/food-question'
import { ClickableDiv } from "@/app/ui/util/clickable-div"
import {FoodFormQuestionAnswerContainer} from "@/app/ui/food-rating/form-answer-container";
import foodFormStyles from '../food-rating.module.css'

const chosenAnswers: FormAnswer = {
    ration: null,
    taste: null,
    price: null,
    temperature: null,
    looks: null
}

export default function FoodSelector()
{
    const [showForm, setShowForm] = useState(false)

    const handleFoodOptionClick = () => { setShowForm(true) }

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
                        <FoodFormQuestionAnswerContainer>
                            <ClickableDiv action={ () => chosenAnswers.ration = 1 }>Určitě ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.ration = 2 }>Spíš ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.ration = 3 }>Ano</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.ration = 4 }>Určitě ano</ClickableDiv>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Bylo jídlo chutné?</label>
                        <FoodFormQuestionAnswerContainer>
                            <ClickableDiv action={ () => chosenAnswers.taste = 1 }>Určitě ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.taste = 2 }>Spíš ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.taste = 3 }>Ano</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.taste = 4 }>Určitě ano</ClickableDiv>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Byly by jste ochotni, si za toto jídlo připlatit?</label>
                        <FoodFormQuestionAnswerContainer>
                            <ClickableDiv action={ () => chosenAnswers.price = 1 }>Určitě ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.price = 2 }>Spíš ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.price = 3 }>Ano</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.price = 4 }>Určitě ano</ClickableDiv>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Bylo jídlo teplé?</label>
                        <FoodFormQuestionAnswerContainer>
                            <ClickableDiv action={ () => chosenAnswers.temperature = 1 }>Určitě ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.temperature = 2 }>Spíš ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.temperature = 3 }>Ano</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.temperature = 4 }>Určitě ano</ClickableDiv>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={foodFormStyles.questionLabel}>Vypadala prezentace jídlo chutně ?</label>
                        <FoodFormQuestionAnswerContainer>
                            <ClickableDiv action={ () => chosenAnswers.looks = 1 }>Určitě ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.looks = 2 }>Spíš ne</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.looks = 3 }>Ano</ClickableDiv>
                            <ClickableDiv action={ () => chosenAnswers.looks = 4 }>Určitě ano</ClickableDiv>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}
