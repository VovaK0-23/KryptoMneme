import React from 'react';

import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { SearchCoinsProvider } from '@/contexts/SearchCoinsContext';
import { SearchParamsProvider } from '@/contexts/SearchParamsContext';

import { ErrorSnackbar } from '@/components/ErrorSnackbar';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const Layout = () => {
  return (
    <ErrorProvider>
      <SearchParamsProvider>
        <CurrencyProvider>
          <SearchCoinsProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box component='main' sx={{ flex: 1 }}>
                <Outlet />
              </Box>
              <ErrorSnackbar />
              <Footer />
            </Box>
          </SearchCoinsProvider>
        </CurrencyProvider>
      </SearchParamsProvider>
    </ErrorProvider>
  );
};
