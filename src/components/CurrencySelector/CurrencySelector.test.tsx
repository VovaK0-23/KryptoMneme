import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/';
import * as React from 'react';

import { CurrencySelector } from './CurrencySelector';

describe('CurrencySelector', () => {
  test('renders correctly and triggers onChange event', async () => {
    const currencies = ['usd', 'eur', 'gbp'];
    const currentCurrency = 'usd';
    const onChange = jest.fn();

    render(
      <CurrencySelector
        currencies={currencies}
        currentCurrency={currentCurrency}
        onChange={onChange}
      />
    );

    const currentCurrencyButton = screen.getByText(/USD/);
    expect(currentCurrencyButton).toBeInTheDocument();

    await userEvent.click(currentCurrencyButton);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const euroMenuItem = screen.getByText(/EUR/);
    await userEvent.click(euroMenuItem);

    expect(onChange).toHaveBeenCalledWith('eur');

    expect(menu).not.toBeInTheDocument();
  });
});
