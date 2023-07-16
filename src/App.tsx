import { Box, CssBaseline } from '@mui/material';
import React from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';

import { ErrorSnackbar } from './components/ErrorSnackbar';
import { Footer } from './components/Footer';
import { ErrorProvider } from './contexts/ErrorContext';

export const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <ErrorProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component='main' sx={{ flex: 1 }}>
              <Home message='Hello World!' />
            </Box>
            <ErrorSnackbar />
            <Footer />
          </Box>
        </ErrorProvider>
      </ErrorBoundary>
    </CustomThemeProvider>
  );
};
