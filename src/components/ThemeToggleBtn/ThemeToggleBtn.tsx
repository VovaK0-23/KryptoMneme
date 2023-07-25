import { Brightness4, Brightness7 } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';
import React, { useContext } from 'react';

import { CustomThemeContext } from '@/contexts/CustomThemeContext';

export const ThemeToggleBtn = () => {
  const theme = useTheme();
  const themeMode = useContext(CustomThemeContext);

  return (
    <IconButton onClick={themeMode.toggle}>
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};
