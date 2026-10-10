import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Resume fonts, self-hosted (Latin subset, weights the templates use) so the
// font picker works for everyone, offline, and in print.
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/roboto/latin-800.css';

import './global.scss';
import './App/styles/main.scss';
import './features/ResumeForm/styles/form.scss';
import './features/ResumeTemplate/styles/template.scss';
import './App/styles/features.scss';

import App from './App';
import ErrorBoundary from './App/components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
