

import "./config"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from 'react-router';
import { Provider } from 'react-redux'
import { getStore } from './management/data';
import { HashRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render
      (<Provider store={getStore()} >
            <HashRouter>
                  <App />
            </HashRouter>
      </Provider>

      );
// reportWebVitals();
