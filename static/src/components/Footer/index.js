import React from 'react';

/* component styles */
import { styles } from './styles.scss';

export const Footer = () =>
    <footer className={`${styles}`}>
        <div className="container">
                <div>
                    <p>© Grickly 2021</p>
                    <a href="https://github.com/grickly-nyu/grickly">More about this project</a>
                </div>
        </div>
    </footer>;
