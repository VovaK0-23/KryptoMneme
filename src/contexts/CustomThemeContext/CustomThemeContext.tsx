import React, { ReactNode, createContext, useCallback, useContext, useMemo } from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

import { noop } from '@/utils';

import { SettingsContext } from '../SettingsContext';

export const CustomThemeContext = createContext({ toggleThemeMode: noop });

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { generalSettings, updateSettings } = useContext(SettingsContext);
  const mode = generalSettings.themeMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#F79413',
          },
        },
      }),
    [mode]
  );

  const toggleThemeMode = useCallback(() => {
    updateSettings('general')({ themeMode: mode === 'light' ? 'dark' : 'light' });
  }, [mode]);

  return (
    <CustomThemeContext.Provider value={{ toggleThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
