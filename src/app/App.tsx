import * as React from 'react';
import styles from './app.module.scss';

// Application
const App = ({}) => {
    React.useEffect(() => {}, []);

    const addToQueue = () => {
        parent.postMessage({pluginMessage: {type: 'add-to-queue'}}, '*');
    };

    return (
        <section className={styles.wrap}>
            <h1>Hello World</h1>
            <button onClick={addToQueue}>add to queue</button>
        </section>
    );
};

export default App;
