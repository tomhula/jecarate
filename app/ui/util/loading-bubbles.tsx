import styles from './util.module.css';

export default function LoadingBubbles()
{
    return (
        <div className={ styles.loadingContainer }>
            <div className={ styles.bubble }></div>
            <div className={ styles.bubble }></div>
            <div className={ styles.bubble }></div>
        </div>
    )
}