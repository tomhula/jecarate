import React, {useState, useEffect} from "react";
import foodFormStyles from "@/app/ui/food-rating/food-rating.module.css";

interface StepSliderProps
{
    labelMap: (value: number) => string;
    onChange: (value: number) => void;
    initialValue?: number;
}

export default function StepSlider({labelMap, onChange, initialValue = 0}: StepSliderProps)
{
    const [selected, setSelected] = useState(false);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const selectedColors = ["#ff6666", "#ff9933", "#fae45b", "#66cc66"];
    const unselectedColors = ["#ff9999", "#ffcccc", "#ffffcc", "#99ff99"];
    const colors = selected ? selectedColors : unselectedColors;
    const stepPositions = [0, 33.33, 66.66, 100];

    // Update currentValue when initialValue changes
    useEffect(() => {
        setCurrentValue(initialValue);
        // Set selected to true if initialValue is not the default value (0)
        if (initialValue !== 0) {
            setSelected(true);
        }
    }, [initialValue]);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const value = parseFloat(event.target.value);
        setCurrentValue(value);
    };

    const handleChange = () =>
    {
        if (!selected)
            setSelected(true);
        // The timeout is needed, because one input change is triggered after mouseUp or touchEnd
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
                        `linear-gradient(to right, ${colors[0]} 25%, ${colors[1]} 25%, ${colors[1]} 50%, ${colors[2]} 50%, ${colors[2]} 75%, ${colors[3]} 75%)`,
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
                onTouchEnd={handleChange}
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
