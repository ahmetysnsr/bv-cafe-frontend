import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import App from './App';
import theme from './theme';
import './i18n'; // Initialize i18n

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <Toaster position="bottom-center" toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '10px',
          }
        }}/>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
