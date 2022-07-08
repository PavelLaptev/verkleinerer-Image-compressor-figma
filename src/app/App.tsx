import * as React from 'react';
import styles from './app.module.scss';

import Resizer from './components/Resizer';

// Application
const App = ({}) => {
    return (
        <section className={styles.wrap}>
            <h1>Hello World</h1>
            <Resizer />
        </section>
    );
};

export default App;
