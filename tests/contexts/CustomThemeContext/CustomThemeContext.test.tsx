import React, { ReactNode, useContext, useState } from 'react';

import { useMediaQuery, useTheme } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CustomThemeContext, CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { SettingsContext } from '@/contexts/SettingsContext';

import { SettingsState } from '@/reducers/settingsReducer';
import { DeepPartial } from '@/types';

describe('CustomThemeProvider', () => {
  const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [generalSettings, setSettings] = useState({
      themeMode: prefersDarkMode ? 'dark' : 'light',
    });

    const updateSettings = () => (payload: DeepPartial<SettingsState['general']>) => {
      setSettings(payload as typeof generalSettings);
    };

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <SettingsContext.Provider value={{ generalSettings, updateSettings } as any}>
        {children}
      </SettingsContext.Provider>
    );
  };

  it('applies light theme when prefers-color-scheme is light', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: light)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const ChildComponent = () => {
      const theme = useTheme();
      return <div data-testid='child'>{theme.palette.mode}</div>;
    };

    render(
      <SettingsProvider>
        <CustomThemeProvider>
          <ChildComponent />
        </CustomThemeProvider>
      </SettingsProvider>
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toHaveTextContent('light');
  });

  it('applies dark theme when prefers-color-scheme is dark', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const ChildComponent = () => {
      const theme = useTheme();
      return <div data-testid='child'>{theme.palette.mode}</div>;
    };

    render(
      <SettingsProvider>
        <CustomThemeProvider>
          <ChildComponent />
        </CustomThemeProvider>
      </SettingsProvider>
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toHaveTextContent('dark');
  });

  it('toggles the theme mode when clicked', async () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: light)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const ChildComponent = () => {
      const { toggleThemeMode } = useContext(CustomThemeContext);
      const theme = useTheme();
      return (
        <div data-testid='child' onClick={toggleThemeMode}>
          {theme.palette.mode}
        </div>
      );
    };

    render(
      <SettingsProvider>
        <CustomThemeProvider>
          <ChildComponent />
        </CustomThemeProvider>
      </SettingsProvider>
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toHaveTextContent('light');

    await userEvent.click(childElement);

    expect(childElement).toHaveTextContent('dark');
  });
});
