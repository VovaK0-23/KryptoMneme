import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, useTheme } from '@mui/material';
import React, { useContext } from 'react';

import logo from '@/assets/logo.png';
import { HideOnScroll } from '@/components/HideOnScroll';
import { Search } from '@/components/Search';
import { CustomThemeContext } from '@/contexts/CustomThemeContext';

export const Header = () => {
  const theme = useTheme();
  const themeMode = useContext(CustomThemeContext);

  return (
    <>
      <HideOnScroll>
        <AppBar color='default'>
          <Toolbar>
            <IconButton>
              <img src={logo} width='24' />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Search />
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={themeMode.toggle}>
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
};
