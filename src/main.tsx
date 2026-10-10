import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './global.scss';
import './App/styles/main.scss';
import './features/ResumeForm/styles/form.scss';
import './features/ResumeTemplate/styles/template.scss';
import './App/styles/features.scss';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
