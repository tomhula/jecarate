'use client';

import { useState } from 'react';
import { FoodOption } from '@/app/ui/food-rating/food-option';

export default function FoodSelector()
{
    const [showForm, setShowForm] = useState(false);

    const handleFoodOptionClick = (food: string) => {
        console.log(`You chose: ${food}`);
        setShowForm(true);
    };

    return (
        <>
            <div className="food-options">
                <FoodOption onClick={() => handleFoodOptionClick('Pizza')}>Pizza</FoodOption>
                <FoodOption onClick={() => handleFoodOptionClick('Burger')}>Burger</FoodOption>
            </div>

            { !showForm && (
                    <div id="message" className="message">
                        Choose a food
                    </div>
                )
            }

            { showForm && (
                <form id="food-form">
                    <div className="form-question">
                        <label htmlFor="q1">What size would you like?</label>
                        <select id="q1" name="size">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>

                    <div className="form-question">
                        <label htmlFor="q2">Do you want extra toppings?</label>
                        <select id="q2" name="toppings">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="form-question">
                        <label htmlFor="q3">What drink would you like?</label>
                        <select id="q3" name="drink">
                            <option value="soda">Soda</option>
                            <option value="water">Water</option>
                            <option value="juice">Juice</option>
                        </select>
                    </div>

                    <div className="form-question">
                        <label htmlFor="q4">Do you want it delivered?</label>
                        <select id="q4" name="delivery">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <button type="submit">Submit</button>
                </form>
            )}
        </>
    );
}
