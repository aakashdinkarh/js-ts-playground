import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { errorHandlerOverrides } from '@utils/errorHandlerOverrides';
import { SessionProvider } from '@contexts/SessionContext';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

errorHandlerOverrides();
root.render(
  <SessionProvider>
    <App />
  </SessionProvider>
);
