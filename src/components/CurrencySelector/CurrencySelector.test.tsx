import * as React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/';

import { CurrencyContext } from '@/contexts/CurrencyContext';

import { CurrencySelector } from './CurrencySelector';

describe('CurrencySelector', () => {
  test('renders correctly and triggers onChange event', async () => {
    const currencies = ['usd', 'eur', 'gbp'];
    const currentCurrency = 'usd';
    const changeCurrentCurrency = jest.fn();

    render(
      <CurrencyContext.Provider value={{ currentCurrency, currencies, changeCurrentCurrency }}>
        <CurrencySelector />
      </CurrencyContext.Provider>
    );

    const currentCurrencyButton = screen.getByText(/USD/);
    expect(currentCurrencyButton).toBeInTheDocument();

    await userEvent.click(currentCurrencyButton);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const euroMenuItem = screen.getByText(/EUR/);
    await userEvent.click(euroMenuItem);

    expect(changeCurrentCurrency).toHaveBeenCalledWith('eur');

    expect(menu).not.toBeInTheDocument();
  });
});
