import React from 'react';

import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

import { CurrencySelector } from '@/components/CurrencySelector';
import { HideOnScroll } from '@/components/HideOnScroll';
import { Search } from '@/components/Search';
import { ThemeToggleBtn } from '@/components/ThemeToggleBtn';

import logo from '@/assets/logo.png';

export const Header = () => {
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
              <CurrencySelector />
              <ThemeToggleBtn />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};
