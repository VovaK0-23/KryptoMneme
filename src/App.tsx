import { CssBaseline } from '@mui/material';
import React from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';

import { ErrorSnackbar } from './components/ErrorSnackbar';
import { ErrorProvider } from './contexts/ErrorContext';

export const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <ErrorProvider>
          <Header />
          <Home message='Hello World!' />
          <ErrorSnackbar />
        </ErrorProvider>
      </ErrorBoundary>
    </CustomThemeProvider>
  );
};
