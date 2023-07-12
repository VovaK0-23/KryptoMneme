import { CssBaseline } from '@mui/material';
import React from 'react';

import { CustomThemeProvider } from '@/context/CustomThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';

export const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
          <Header />
          <Home message='Hello World!' />
      </ErrorBoundary>
    </CustomThemeProvider>
  );
};
