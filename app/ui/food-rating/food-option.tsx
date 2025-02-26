'use client';

import styles from './food-rating.module.css';

export function FoodOption(props: {
    children: string;
    id: string;
    onClick: (id: string) => void;
    selectedId: string;
}) {
    const isSelected = props.selectedId === props.id;

    return (
        <div
            className={`${styles.foodOption} ${isSelected ? styles.selected : ''}`}
            onClick={() => props.onClick(props.id)}
        >
            {props.children}
        </div>
    );
}
