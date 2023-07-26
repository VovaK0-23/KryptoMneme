import React from 'react';

import { Route, HashRouter as Router, Routes } from 'react-router-dom';

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

import { SearchParamsProvider } from './contexts/SearchParamsContext';
import { Coin } from './pages/Coin/Coin';

export const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <ErrorBoundary>
        <ErrorProvider>
          <Router future={{ v7_startTransition: true }}>
            <SearchParamsProvider>
              <CurrencyProvider>
                <SearchCoinsProvider>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <Box component='main' sx={{ flex: 1 }}>
                      <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/:coinId' element={<Coin />} />
                      </Routes>
                    </Box>
                    <ErrorSnackbar />
                    <Footer />
                  </Box>
                </SearchCoinsProvider>
              </CurrencyProvider>
            </SearchParamsProvider>
          </Router>
        </ErrorProvider>
      </ErrorBoundary>
    </CustomThemeProvider>
  );
};
