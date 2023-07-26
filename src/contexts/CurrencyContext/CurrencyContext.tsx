import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { CoinGeckoService } from '@/services/coingecko';
import { LSService } from '@/services/localStorage';

import { useEffectOnChange } from '@/hooks';

import { ErrorContext } from '../ErrorContext';
import { SearchParamsContext } from '../SearchParamsContext';

export const CurrencyContext = createContext<{
  changeCurrentCurrency: (currency: string) => void;
  currentCurrency: string;
  currencies: string[];
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeCurrentCurrency: () => {},
  currentCurrency: 'usd',
  currencies: [],
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsContext);
  const { dispatchError } = useContext(ErrorContext);
  const [currentCurrency, setCurrentCurrency] = useState(
    searchParams.get('currency') ?? LSService.currentCurrency.get() ?? 'usd'
  );
  const [currencies, setCurrencies] = useState(['usd', 'btc']);

  const location = useLocation();

  const changeCurrentCurrency = (currency: string) => {
    setCurrentCurrency(currency);
    searchParams.set('currency', currency);
    setSearchParams(searchParams);
    LSService.currentCurrency.set(currency);
  };

  useEffect(() => {
    (async () => {
      const res = await CoinGeckoService.supportedVsCurrencies();
      if (res.ok) {
        const currencies = res.data.sort();
        setCurrencies(currencies);
      } else {
        dispatchError({
          type: 'ADD',
          payload: res.error,
        });
      }
    })();
  }, []);

  useEffect(() => {
    searchParams.set('currency', currentCurrency);
    setSearchParams(searchParams);
  }, [location.pathname]);

  useEffectOnChange(() => {
    setCurrentCurrency(searchParams.get('currency') ?? 'usd');
  }, [searchParams.get('currency')]);

  return (
    <CurrencyContext.Provider value={{ currencies, currentCurrency, changeCurrentCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
