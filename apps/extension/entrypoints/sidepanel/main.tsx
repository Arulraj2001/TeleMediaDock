import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mediadock/ui';
import App from './App';
import { ExtensionErrorBoundary } from '../../src/components/ExtensionErrorBoundary';
import '../../assets/main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ExtensionErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ExtensionErrorBoundary>
  </React.StrictMode>
);
