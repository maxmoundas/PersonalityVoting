/*
client/src/index.js: This is the entry point for the React 
application, where the App component is rendered to the root 
element of the DOM. It also sets up the Redux store and wraps 
the App component with the Redux Provider.
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(<App />);
