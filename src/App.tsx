import { CssBaseline } from '@mui/material';
import React from 'react';

import { CustomThemeProvider } from '@/context/CustomThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';

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
