import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { errorHandlerOverrides } from '@utils/errorHandlerOverrides';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

errorHandlerOverrides();
root.render(<App />);
