import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Settings } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

import { CurrencySelector } from '@/components/CurrencySelector';
import { HideOnScroll } from '@/components/HideOnScroll';
import { Search } from '@/components/Search';

import logo from '@/assets/logo.png';

import { SettingsDrawer } from '../SettingsDrawer';

export const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const openSettingsDrawer = () => {
    setOpenDrawer(true);
  };

  const closeSettingsDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar color='default'>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to='/'>
              <IconButton>
                <img src={logo} width='24' />
              </IconButton>
            </Link>

            <Search />

            <Box sx={{ display: 'flex' }}>
              <CurrencySelector />

              <IconButton onClick={openSettingsDrawer}>
                <Settings />
              </IconButton>
            </Box>

            <SettingsDrawer onClose={closeSettingsDrawer} open={openDrawer} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};
