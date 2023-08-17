import React, { ReactNode, useContext, useState } from 'react';

import { useTheme } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SettingsState } from '@/reducers/settingsReducer';
import { DeepPartial } from '@/types';

import { SettingsContext } from '../SettingsContext';
import { CustomThemeContext, CustomThemeProvider } from './CustomThemeContext';

describe('CustomThemeProvider', () => {
  const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState({ general: { themeMode: 'dark' } });

    const updateSettings = (payload: DeepPartial<SettingsState>) => {
      setSettings(payload as typeof settings);
    };

    return (
      <SettingsContext.Provider value={{ settings: settings as SettingsState, updateSettings }}>
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
      const themeMode = useContext(CustomThemeContext);
      const theme = useTheme();
      return (
        <div data-testid='child' onClick={themeMode.toggle}>
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
