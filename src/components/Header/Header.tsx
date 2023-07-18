import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, useTheme } from '@mui/material';
import React, { useContext } from 'react';

import logo from '@/assets/logo.png';
import { HideOnScroll } from '@/components/HideOnScroll';
import { Search } from '@/components/Search';
import { CurrencyContext } from '@/contexts/CurrencyContext';
import { CustomThemeContext } from '@/contexts/CustomThemeContext';

import { CurrencySelector } from '../CurrencySelector';

export const Header = () => {
  const theme = useTheme();
  const themeMode = useContext(CustomThemeContext);
  const { currencies, currentCurrency, changeCurrentCurrency } = useContext(CurrencyContext);

  return (
    <>
      <HideOnScroll>
        <AppBar color='default'>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton>
              <img src={logo} width='24' />
            </IconButton>

            <Search />

            <Box sx={{ display: 'flex' }}>
              <CurrencySelector
                currencies={currencies}
                currentCurrency={currentCurrency}
                onChange={changeCurrentCurrency}
              />

              <IconButton onClick={themeMode.toggle}>
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};
