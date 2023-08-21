import React, { useContext } from 'react';

import { Brightness4, Brightness7 } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';

import { CustomThemeContext } from '@/contexts/CustomThemeContext';

export const ThemeToggleBtn = () => {
  const theme = useTheme();
  const { toggleTheme } = useContext(CustomThemeContext);

  return (
    <IconButton onClick={toggleTheme}>
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};
