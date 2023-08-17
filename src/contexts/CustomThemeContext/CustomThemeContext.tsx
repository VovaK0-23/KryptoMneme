import React, { ReactNode, createContext, useContext, useEffect, useMemo } from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme, useMediaQuery } from '@mui/material';

import { SettingsContext } from '../SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CustomThemeContext = createContext({ toggle: () => {} });

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const mode = settings.general.themeMode;

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
        updateSettings({ general: { themeMode: mode === 'light' ? 'dark' : 'light' } });
      },
    }),
    [mode]
  );

  useEffect(() => {
    updateSettings({ general: { themeMode: prefersDarkMode ? 'dark' : 'light' } });
  }, [prefersDarkMode]);

  return (
    <CustomThemeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
