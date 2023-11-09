import React, { ReactNode, createContext, useEffect, useRef, useState } from 'react';

import { PriceScaleMode } from 'lightweight-charts';
import { SetURLSearchParams, useLocation, useSearchParams } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';

import { DeepPartial } from '@/types';
import { deepMerge, noop } from '@/utils';

const defaultSettingsState = {
  general: {
    themeMode: 'dark' as 'dark' | 'light',
    currency: 'usd',
    q: '',
  },
  home: {
    page: 0,
    perPage: 10,
  },
  coin: {
    priceScaleMode: PriceScaleMode.Normal,
    priceAutoScale: true,
    days: '1',
  },
};

export type SettingsState = typeof defaultSettingsState;

export const SettingsContext = createContext<{
  generalSettings: SettingsState['general'];
  homeSettings: SettingsState['home'];
  coinSettings: SettingsState['coin'];
  updateSettings: <T extends keyof SettingsState>(
    key: T
  ) => (payload: DeepPartial<SettingsState[T]>, updateSearchParams?: boolean) => void;
}>({
  generalSettings: defaultSettingsState.general,
  homeSettings: defaultSettingsState.home,
  coinSettings: defaultSettingsState.coin,
  updateSettings: () => noop,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const changedSearchParams = useRef(true);
  const location = useLocation();

  const setSearchParams: SetURLSearchParams = (params, navigateOpts) => {
    changedSearchParams.current = true;
    return _setSearchParams(params, navigateOpts);
  };

  const [generalSettings, setGeneralSettings] = useState(
    settingsBuilder('general', defaultSettingsState.general)
      .fromPreferedColorScheme()
      .fromLocalStorage()
      .fromSearchParams(searchParams)
      .build()
  );

  const [homeSettings, setHomeSettings] = useState(
    settingsBuilder('home', defaultSettingsState.home)
      .fromLocalStorage()
      .fromSearchParams(searchParams)
      .build()
  );

  const [coinSettings, setCoinSettings] = useState(
    settingsBuilder('coin', defaultSettingsState.coin)
      .fromLocalStorage()
      .fromSearchParams(searchParams)
      .build()
  );

  const updateGeneralParams = (payload: Partial<SettingsState['general']>) => {
    if (payload.currency) {
      searchParams.set('currency', payload.currency);
    }
    if (payload.q) {
      searchParams.set('q', payload.q);
    } else searchParams.delete('q');
  };

  const updateHomeParams = (payload: Partial<SettingsState['home']>) => {
    if (payload.page !== undefined) {
      searchParams.set('page', payload.page.toString());
    }
    if (payload.perPage) {
      searchParams.set('perPage', payload.perPage.toString());
    }
  };

  const updateCoinParams = (payload: Partial<SettingsState['coin']>) => {
    if (payload.priceScaleMode !== undefined) {
      searchParams.set('scaleMode', payload.priceScaleMode.toString());
    }
    if (payload.priceAutoScale !== undefined) {
      searchParams.set('autoScale', payload.priceAutoScale.toString());
    }
    if (payload.days) {
      searchParams.set('days', payload.days);
    }
  };

  const updateSettings =
    <T extends keyof SettingsState>(key: T) =>
    (payload: DeepPartial<SettingsState[T]>, updateSearchParams = true) => {
      const currentSettings =
        key === 'home' ? homeSettings : key === 'coin' ? coinSettings : generalSettings;

      const newSettings = deepMerge(currentSettings, payload);
      localStorage.setItem(key, JSON.stringify(newSettings));

      const prevSearchParams = searchParams.toString();

      switch (key) {
        case 'general': {
          setGeneralSettings({ ...(newSettings as SettingsState['general']) });
          if (updateSearchParams)
            updateGeneralParams(payload as DeepPartial<SettingsState['general']>);
          break;
        }
        case 'home': {
          setHomeSettings({ ...(newSettings as SettingsState['home']) });
          if (updateSearchParams) updateHomeParams(payload as DeepPartial<SettingsState['home']>);
          break;
        }
        case 'coin': {
          setCoinSettings({ ...(newSettings as SettingsState['coin']) });
          if (updateSearchParams) updateCoinParams(payload as DeepPartial<SettingsState['coin']>);
          break;
        }
      }

      if (updateSearchParams && searchParams.toString() !== prevSearchParams) {
        setSearchParams(searchParams);
      }
    };

  useEffect(() => {
    if (location.pathname === '/') {
      searchParams.set('page', homeSettings.page.toString());
      searchParams.set('perPage', homeSettings.perPage.toString());
    }
    if (location.pathname.includes('/coin/')) {
      searchParams.set('scaleMode', coinSettings.priceScaleMode.toString());
      searchParams.set('autoScale', coinSettings.priceAutoScale.toString());
      searchParams.set('days', coinSettings.days);
    }

    if (location.pathname === '/' || location.pathname.includes('/coin/')) {
      generalSettings.q && searchParams.set('q', generalSettings.q);
      searchParams.set('currency', generalSettings.currency.toString());
      setSearchParams(searchParams, { replace: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (changedSearchParams.current) {
      changedSearchParams.current = false;
      return;
    }

    updateSettings('general')(
      settingsBuilder('general', generalSettings).fromSearchParams(searchParams).build(),
      false
    );
    updateSettings('home')(
      settingsBuilder('home', homeSettings).fromSearchParams(searchParams).build(),
      false
    );
    updateSettings('coin')(
      settingsBuilder('coin', coinSettings).fromSearchParams(searchParams).build(),
      false
    );
  }, [searchParams]);

  return (
    <SettingsContext.Provider
      value={{
        generalSettings,
        homeSettings,
        coinSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const settingsBuilder = <K extends keyof SettingsState, T extends SettingsState[K]>(
  key: K,
  defaultSettings: T
) => {
  let settings: T = { ...defaultSettings };

  function fromPreferedColorScheme() {
    if (key === 'general') {
      const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

      settings = deepMerge(settings, {
        themeMode: prefersDarkMode ? 'dark' : 'light',
      } as unknown as DeepPartial<T>);
    }

    return builder;
  }

  function fromLocalStorage() {
    const localStorageState = localStorage.getItem(key);

    if (localStorageState) {
      let parsed;
      try {
        parsed = JSON.parse(localStorageState);
      } catch {
        parsed = null;
      }
      if (parsed) settings = deepMerge(settings, parsed);
    }

    return builder;
  }

  function fromSearchParams(searchParams: URLSearchParams) {
    const getSearchParamNumber = (name: string) => {
      const param = searchParams.get(name);
      if (param && !isNaN(parseInt(param))) return parseInt(param);
    };

    switch (key) {
      case 'general': {
        const currency = searchParams.get('currency') || undefined;
        const q = searchParams.get('q') || undefined;

        settings = deepMerge(settings, { currency, q } as DeepPartial<T>);
        break;
      }
      case 'home': {
        const page = getSearchParamNumber('page');
        const perPage = getSearchParamNumber('perPage');

        settings = deepMerge(settings, { page, perPage } as DeepPartial<T>);
        break;
      }
      case 'coin': {
        const priceScaleMode = getSearchParamNumber('scaleMode');
        const priceAutoScaleParam = searchParams.get('autoScale');
        const priceAutoScale = priceAutoScaleParam ? priceAutoScaleParam === 'true' : undefined;
        const days = searchParams.get('days') || undefined;

        settings = deepMerge(settings, { priceScaleMode, priceAutoScale, days } as DeepPartial<T>);
        break;
      }
    }

    return builder;
  }

  function build() {
    return { ...settings };
  }

  const builder = {
    fromPreferedColorScheme,
    fromSearchParams,
    fromLocalStorage,
    build,
  };

  return builder;
};
