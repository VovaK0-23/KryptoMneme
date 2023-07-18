import { ThemeProvider } from '@emotion/react';
import { PaletteMode, createTheme, useMediaQuery } from '@mui/material';
import React, { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

import { useEffectOnChange } from '@/hooks';
import { localStorageService } from '@/services/localStorage';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CustomThemeContext = createContext({ toggle: () => {} });

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          secondary: {
            main: '#ffc107',
          },
        },
      }),
    [mode]
  );

  const themeMode = useMemo(
    () => ({
      toggle: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorageService.themeMode.set(newMode);
          return newMode;
        });
      },
    }),
    []
  );

  useEffectOnChange(() => {
    const newMode = prefersDarkMode ? 'dark' : 'light';
    localStorageService.themeMode.set(newMode);
    setMode(newMode);
  }, [prefersDarkMode]);

  useEffect(() => {
    setMode(localStorageService.themeMode.get() ?? mode);
  }, []);

  return (
    <CustomThemeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
