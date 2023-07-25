import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { CoinGeckoService } from '@/services/coingecko';
import { localStorageService } from '@/services/localStorage';

import { ErrorContext } from '../ErrorContext';

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
  const [currentCurrency, setCurrentCurrency] = useState(
    localStorageService.currentCurrency.get() ?? 'usd'
  );
  const [currencies, setCurrencies] = useState(['usd', 'btc']);
  const { dispatchError } = useContext(ErrorContext);

  const changeCurrentCurrency = useCallback((currency: string) => {
    localStorageService.currentCurrency.set(currency);
    setCurrentCurrency(currency);
  }, []);

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

  return (
    <CurrencyContext.Provider value={{ currencies, currentCurrency, changeCurrentCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
