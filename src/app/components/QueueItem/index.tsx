import React from 'react';
import styles from './styles.module.scss';

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

            <div>
                <span>{props.imageData.name}</span>
                <span>
                    {props.imageData.size.width} x {props.imageData.size.height}
                </span>
            </div>

            <button onClick={props.onRemove}>remove</button>
        </div>
    );
};

export default QueueItem;
