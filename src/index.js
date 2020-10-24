import ReactDOM from 'react-dom';
import React from 'react';
import './index.css';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import Skyvue from './Skyvue';
import * as serviceWorker from './serviceWorker';

const myEnv = dotenv.config();
dotenvExpand(myEnv);

ReactDOM.render(
  <React.StrictMode>
    <Skyvue />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
