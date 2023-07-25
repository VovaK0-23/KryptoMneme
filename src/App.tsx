import React from 'react';

import { Box, CssBaseline } from '@mui/material';

import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { SearchCoinsProvider } from '@/contexts/SearchCoinsContext';

import { ErrorSnackbar } from '@/components/ErrorSnackbar';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import { ErrorBoundary } from '@/pages/ErrorBoundary';
import { Home } from '@/pages/Home';

export const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <ErrorProvider>
          <CurrencyProvider>
            <SearchCoinsProvider>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <Box component='main' sx={{ flex: 1 }}>
                  <Home />
                </Box>
                <ErrorSnackbar />
                <Footer />
              </Box>
            </SearchCoinsProvider>
          </CurrencyProvider>
        </ErrorProvider>
      </ErrorBoundary>
    </CustomThemeProvider>
  );
};
