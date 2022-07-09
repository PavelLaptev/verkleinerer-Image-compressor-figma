import * as React from 'react';
import styles from './app.module.scss';

import Resizer from './components/Resizer';
import QueueItem from './components/QueueItem';

// Application
const App = ({}) => {
    const [scaleRatio, setScaleRatio] = React.useState('2');
    const [imageDataArray, setImageDataArray] = React.useState([]);

    React.useEffect(() => {
        onmessage = e => {
            if (e.data.pluginMessage?.type === 'imageData') {
                // console.log(imageData, e.data.pluginMessage.imageData.id);
                // console.log(imageData);

                // add to the state array
                setImageDataArray(prevStae => {
                    // if the image is already in the state, update it
                    const index = prevStae.findIndex(item => item.id === e.data.pluginMessage.imageData.id);
                    if (index !== -1) {
                        return [
                            ...prevStae.slice(0, index),
                            {
                                ...prevStae[index],
                                ...e.data.pluginMessage.imageData,
                            },
                            ...prevStae.slice(index + 1),
                        ];
                    }

                    return [...prevStae, e.data.pluginMessage.imageData];
                });

                //
            }
        };
    }, []);

    const addToQueue = () => {
        parent.postMessage({pluginMessage: {type: 'add-to-queue'}}, '*');
    };

    const handleRemove = id => {
        setImageDataArray(prevState => prevState.filter(item => item.id !== id));
    };

    const sendIds = () => {
        parent.postMessage(
            {pluginMessage: {type: 'send-ids', scaleRatio: scaleRatio, ids: imageDataArray.map(item => item.id)}},
            '*'
        );
    };

    return (
        <>
            <section className={styles.wrap}>
                <h1>Hello World</h1>
                <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue={scaleRatio}
                    onMouseUp={event => setScaleRatio((event.target as HTMLInputElement).value)}
                />
                <button onClick={addToQueue}>add to queue</button>
                <button onClick={sendIds}>convert to WebP</button>

                {imageDataArray.map(imageData => {
                    return (
                        <QueueItem
                            key={imageData.id}
                            imageData={imageData}
                            onRemove={() => handleRemove(imageData.id)}
                        />
                    );
                })}
            </section>
            <Resizer />
        </>
    );
};

export default App;
