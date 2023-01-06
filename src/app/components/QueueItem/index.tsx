import React from "react";
import styles from "./styles.module.scss";

interface Props {
    imageData: {
        id: string;
        preview: string;
        name: string;
        size: {
            width: number;
            height: number;
        };
    };
    scaleRatio: number;
    onRemove: () => void;
}

const QueueItem: React.FC<Props> = props => {
    return (
        <div id={props.imageData.id} className={styles.wrap}>
            <div className={styles.preview}>
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(data:image/jpeg;base64,${props.imageData.preview})`,
                    }}
                />
            </div>

            <div className={styles.content}>
                <span className={styles.title}>{props.imageData.name}</span>
                <span className={styles.caption}>
                    @1x: {props.imageData.size.width}x{props.imageData.size.height}px → @{props.scaleRatio}x:{" "}
                    {props.imageData.size.width * props.scaleRatio}x{props.imageData.size.height * props.scaleRatio}px
                </span>
            </div>

            <div onClick={props.onRemove} className={styles.cross}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="22" height="22" rx="11" />
                    <path d="M6 6L16 16M16 6L6 16" stroke="var(--main-color)" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
};

export default QueueItem;
