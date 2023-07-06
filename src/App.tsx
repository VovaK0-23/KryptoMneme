import { CssBaseline } from '@mui/material';
import React from 'react';

import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { CustomThemeProvider } from '@/context/CustomThemeProvider';

export const App = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Header />
      <Home message='Hello World!' />
    </CustomThemeProvider>
  );
};
