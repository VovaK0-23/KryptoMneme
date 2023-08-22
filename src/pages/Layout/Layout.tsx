import React from 'react';

import { Outlet } from 'react-router-dom';

import { Box, CssBaseline } from '@mui/material';

import { ConfirmationProvider } from '@/contexts/ConfirmationContext/ConfirmationContext';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { SearchCoinsProvider } from '@/contexts/SearchCoinsContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ShortcutsProvider } from '@/contexts/ShortcutsContext';

import { ErrorSnackbar } from '@/components/ErrorSnackbar';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const Layout = () => {
  return (
    <SettingsProvider>
      <CustomThemeProvider>
        <ShortcutsProvider>
          <CssBaseline />
          <ConfirmationProvider>
            <ErrorProvider>
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
            </ErrorProvider>
          </ConfirmationProvider>
        </ShortcutsProvider>
      </CustomThemeProvider>
    </SettingsProvider>
  );
};
