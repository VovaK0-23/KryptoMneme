import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/';

import { SettingsContext } from '@/contexts/SettingsContext';

import { CurrencySelector } from '@/components/CurrencySelector';

import { SettingsState } from '@/reducers/settingsReducer';
import { DeepPartial } from '@/types';

describe('CurrencySelector', () => {
  beforeAll(() => {
    console.group = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
    console.groupEnd = jest.fn();
  });

  const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = React.useState({ general: { currency: 'usd' } });

    const updateSettings = (payload: DeepPartial<SettingsState>) => {
      setSettings(payload as typeof settings);
    };

    return (
      <SettingsContext.Provider value={{ settings: settings as SettingsState, updateSettings }}>
        {children}
      </SettingsContext.Provider>
    );
  };

  test('renders correctly and changes currency', async () => {
    render(
      <SettingsProvider>
        <CurrencySelector />
      </SettingsProvider>
    );

    const currentCurrencyButton = screen.getByText(/USD/);
    expect(currentCurrencyButton).toBeInTheDocument();

    await userEvent.click(currentCurrencyButton);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const euroMenuItem = screen.getByText(/BTC/);
    await userEvent.click(euroMenuItem);

    expect(menu).not.toBeInTheDocument();
    expect(screen.getByText(/BTC/)).toBeInTheDocument();
  });
});
