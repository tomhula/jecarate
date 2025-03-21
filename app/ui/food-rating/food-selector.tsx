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
    const [hasRatedSoup, setHasRatedSoup] = useState(false)
    const [hasRatedMeal, setHasRatedMeal] = useState(false)
    const [containsDessert, setContainsDessert] = useState(false);

    useEffect(() =>
    {
        if (!authorize())
        {
            window.location.href = '/login'
            return
        }

        fetch('/api/todays-menu', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ localStorage.getItem('token') || '' }`,
                'Content-Type': 'application/json'
            }
        }).then(response =>
        {
            if (!response.ok)
            {
                return { items: [], hasRatedSoup: false, hasRatedMeal: false }
            }
            return response.json()
        })
            .then((response: any) =>
            {
                setMenuItems(response.todayMenu.items)// Assumes the response includes { items: MenuItem[] }
                setHasRatedMeal(response.hasRatedMeal)
                setHasRatedSoup(response.hasRatedSoup)
                console.log(response)
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

    const [chosenAnswers, setChosenAnswers] = useState<FormAnswer>({
        ration: null,
        taste: null,
        price: null,
        temperature: null,
        looks: null,
        desert: null,
        isSoup: 0
    });

    // Save answers to local storage
    const saveAnswersToLocalStorage = (foodId: string, answers: FormAnswer) => {
        localStorage.setItem(`food-rating-${foodId}`, JSON.stringify(answers));
    };

    // Load answers from local storage
    const loadAnswersFromLocalStorage = (foodId: string): FormAnswer | null => {
        const savedAnswers = localStorage.getItem(`food-rating-${foodId}`);
        return savedAnswers ? JSON.parse(savedAnswers) : null;
    };

    const handleFoodOptionClick = (id: string, isSoup: boolean) =>
    {
        // Try to load saved answers for this food
        const savedAnswers = loadAnswersFromLocalStorage(id);

        if (savedAnswers) {
            // If we have saved answers, use them
            setChosenAnswers({
                ...savedAnswers,
                isSoup: isSoup ? 1 : 0
            });
        } else {
            // Otherwise, reset all sliders to null (unrated)
            setChosenAnswers({
                ration: null,
                taste: null,
                price: null,
                temperature: null,
                looks: null,
                desert: null,
                isSoup: isSoup ? 1 : 0
            });
        }

        setShowForm(true);
        handleSelect(id);
    };

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
                answers: answers.desert === null ? { ...answers, desert: -1 } : answers,
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
                // Clear saved answers from local storage after successful submission
                localStorage.removeItem(`food-rating-${selectedId}`);

                showAlertBubble("success", "Hodnocení odesláno!")
                setShowForm(false)
                setSelectedId('')
                setTimeout(() => window.location.href = "/dashboard", 1000)
            })
    }

    function handleDessertChange()
    {
        const newContainsDessert = !containsDessert;
        setContainsDessert(newContainsDessert);

        // Update chosen answers
        const newAnswers = {
            ...chosenAnswers,
            // If dessert is checked, set to 0 if it was null, otherwise keep the existing value
            // If dessert is unchecked, set to null
            desert: newContainsDessert ? (chosenAnswers.desert === null ? 0 : chosenAnswers.desert) : null
        };
        setChosenAnswers(newAnswers);

        // Save to local storage
        if (selectedId) {
            saveAnswersToLocalStorage(selectedId, newAnswers);
        }
    }

    // Function to update a specific rating and save to local storage
    const updateRating = (key: keyof FormAnswer, value: number) => {
        const newAnswers = {
            ...chosenAnswers,
            [key]: value
        };
        setChosenAnswers(newAnswers);

        // Save to local storage
        if (selectedId) {
            saveAnswersToLocalStorage(selectedId, newAnswers);
        }
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
        <div className={ 'page-container' }>
            {/* Soup Below the Line */ }
            { !hasRatedSoup && menuItems?.[0]?.soup && (
                <div className={ foodFormStyles.soupContainer }>
                    <FoodOption
                        key={ "soup" }
                        id={ menuItems[0].soup }
                        selectedId={ selectedId }
                        onClick={ () => handleFoodOptionClick(menuItems[0].soup, true) }
                    >
                        { menuItems[0].soup }
                    </FoodOption>
                </div>
            ) }
            {/* Separation Line */ }
            <div className={ foodFormStyles.separatorLine }></div>

            { menuItems != null ? (
                menuItems.length === 0 ? (
                    <div className={ foodFormStyles.message }>No menu for today</div>
                ) : (
                    !hasRatedMeal ? (
                        <div className={ foodFormStyles.foodOptionsContainer }>
                        {/* Meals on the Same Line */ }
                        <div className={ foodFormStyles.foodOptions }>
                            { menuItems.map((item) => (
                                <FoodOption
                                    key={ item.number }
                                    id={ item.description }
                                    selectedId={ selectedId }
                                    onClick={ () => handleFoodOptionClick(item.description, false) }
                                >
                                    { item.description }
                                </FoodOption>
                            )) }
                        </div>
                        </div>
                    ) : (
                        <div className={ foodFormStyles.message }>
                            Již jste ohodnotili dnešní oběd
                        </div>
                    )
                )
            ) : (
                <LoadingBubbles/>
            ) }

            { !showForm && (
                <div id="message" className={ foodFormStyles.message }>
                    Zvolte oběd
                </div>
            ) }
            { showForm && (
                <form id="food-form">

                    { (selectedId != menuItems?.[0]?.soup) && (
                        <FoodFormQuestion>
                            <label className={ foodFormStyles.dessertCheckboxContainer }>
                                Měl oběd také dezert?
                                <input
                                    className={ foodFormStyles.dessertCheckbox }
                                    type="checkbox"
                                    checked={ containsDessert }
                                    onChange={ () => handleDessertChange() }
                                />
                                <span className={ foodFormStyles.customCheckbox }></span>
                            </label>
                        </FoodFormQuestion>
                    ) }

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Byla porce uspokojivá?</label>
                        <RatingSlider labelMap={ ratingLabelMap }
                                      onChange={ val => updateRating('ration', val) }
                                      value={ chosenAnswers.ration }></RatingSlider>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Bylo jídlo chutné?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => updateRating('taste', val) }
                                          value={ chosenAnswers.taste }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Byli by jste ochotni, si za toto jídlo
                            připlatit?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => updateRating('price', val) }
                                          value={ chosenAnswers.price }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Mělo jídlo správnou teplotu?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => updateRating('temperature', val) }
                                          value={ chosenAnswers.temperature }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    <FoodFormQuestion>
                        <label className={ foodFormStyles.questionLabel }>Vypadala prezentace jídla chutně ?</label>
                        <FoodFormQuestionAnswerContainer>
                            <RatingSlider labelMap={ ratingLabelMap }
                                          onChange={ val => updateRating('looks', val) }
                                          value={ chosenAnswers.looks }></RatingSlider>
                        </FoodFormQuestionAnswerContainer>
                    </FoodFormQuestion>

                    { containsDessert && (
                        <FoodFormQuestion>
                            <label className={ foodFormStyles.questionLabel }>Byl dezert také chutný?</label>
                            <FoodFormQuestionAnswerContainer>
                                <RatingSlider labelMap={ ratingLabelMap }
                                              onChange={ val => updateRating('desert', val) }
                                              value={ chosenAnswers.desert }></RatingSlider>
                            </FoodFormQuestionAnswerContainer>
                        </FoodFormQuestion>
                    ) }

                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button type="button" onClick={() => postAnswers(chosenAnswers)}
                                className={foodFormStyles.submitButton}>Odeslat
                        </button>
                    </div>
                </form>
            ) }
        </div>
    )
}
