'use client'

export function FoodOption(props: { children: string; onClick: () => void })
{
    return (
        <div className="food-option" onClick={props.onClick}>
            {props.children}
        </div>
    )
}
