import styles from './util.module.css';

export default function LoadingBubbles(params: { className?: string[] }) {
    return (
        <div className={`${styles.loadingContainer} ${params.className?.join(' ') || ''}`}>
            <div className={ styles.bubble }></div>
            <div className={ styles.bubble }></div>
            <div className={ styles.bubble }></div>
        </div>
    );
}