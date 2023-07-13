import { ThemeProvider } from '@emotion/react';
import { PaletteMode, createTheme, useMediaQuery } from '@mui/material';
import React, { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

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
      toggle: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  return (
    <CustomThemeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
