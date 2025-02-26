import React, {useState} from "react";
import foodFormStyles from "@/app/ui/food-rating/food-rating.module.css";

interface StepSliderProps
{
    labelMap: (value: number) => string;
    onChange: (value: number) => void;
}

export default function StepSlider({labelMap, onChange}: StepSliderProps)
{
    const [currentValue, setCurrentValue] = useState(0);
    const colors = ["#ffcccc", "#ffd9b3", "#cccccc", "#c1f2c1"];
    const stepPositions = [0, 33.33, 66.66, 100];

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = parseFloat(event.target.value);
        setCurrentValue(value);
    };

    const handleChange = () =>
    {
        // The timeout is needed, because one input change is triggered after mouseUp
        setTimeout(() =>
        {
            const roundedValue = Math.round(currentValue);
            setCurrentValue(roundedValue);
            onChange(roundedValue);
        }, 10);
    };

    const currentColor = colors[Math.round(currentValue)];
    const sliderPosition = stepPositions[Math.round(currentValue)];

    return (
        <div className={foodFormStyles.ratingSlider} style={{position: "relative", width: "320px", textAlign: "center"}}>
            {/* Background Track */}
            <div
                className="slider-track"
                style={{
                    width: "100%",
                    height: "10px",
                    background:
                        "linear-gradient(to right, #ffcccc 25%, #ffd9b3 25%, #ffd9b3 50%, #cccccc 50%, #cccccc 75%, #c1f2c1 75%)",
                    borderRadius: "5px",
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            ></div>

            {/* Slider Input */}
            <input
                type="range"
                min="0"
                max="3"
                step="0.01"
                value={currentValue}
                onInput={handleInput}
                onMouseUp={handleChange}
                style={{
                    width: "100%",
                    appearance: "none",
                    background: "transparent",
                    position: "relative",
                    zIndex: 2,
                    marginTop: "4px",
                    "--thumb-color": currentColor,
                } as React.CSSProperties}
            />

            {/* Thumb Dynamic Style */}
            <style>
                {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 30px;
            height: 50px;
            border-radius: 10px;
            background: var(--thumb-color);
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }

          input[type="range"]::-moz-range-thumb {
            width: 30px;
            height: 50px;
            border-radius: 10px;
            background: var(--thumb-color);
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }
        `}
            </style>

            {/* Current Value Label */}
            <div
                className="slider-value"
                style={{
                    position: "absolute",
                    top: "60px",
                    left: `${sliderPosition}%`,
                    width: "100px",
                    fontSize: "18px",
                    color: currentColor,
                    fontWeight: "bold",
                    transform: "translateX(-50%)",
                    transition: "left 0.3s ease, color 0.3s ease",
                }}
            >
                {labelMap(Math.round(currentValue))}
            </div>
        </div>
    );
}
