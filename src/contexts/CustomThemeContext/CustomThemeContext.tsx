import React, { ReactNode, createContext, useCallback, useContext, useMemo } from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

import { SettingsContext } from '../SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CustomThemeContext = createContext({ toggleTheme: () => {} });

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const mode = settings.general.themeMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ffc107',
          },
        },
      }),
    [mode]
  );

  const toggleTheme = useCallback(() => {
    updateSettings({ general: { themeMode: mode === 'light' ? 'dark' : 'light' } });
  }, [mode]);

  return (
    <CustomThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
