import React, { ReactNode, createContext, useCallback, useContext, useMemo } from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

import { SettingsContext } from '../SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const CustomThemeContext = createContext({ toggleThemeMode: () => {} });

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const mode = settings.general.themeMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#F79413',
          },
          secondary: {
            main: '#A25AD9',
          },
        },
      }),
    [mode]
  );

  const toggleThemeMode = useCallback(() => {
    updateSettings({ general: { themeMode: mode === 'light' ? 'dark' : 'light' } });
  }, [mode]);

  return (
    <CustomThemeContext.Provider value={{ toggleThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
