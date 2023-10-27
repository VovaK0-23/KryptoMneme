import React, { ReactNode, createContext, useEffect, useReducer, useRef } from 'react';

import { useLocation, useSearchParams } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';

import {
  SettingsState,
  UpdateSettingsAction,
  settingsDefaultState,
  settingsReducer,
} from '@/reducers/settingsReducer';
import { DeepPartial } from '@/types';
import { deepMerge, noop } from '@/utils';

export const SettingsContext = createContext<{
  settings: SettingsState;
  updateSettings: (payload: UpdateSettingsAction['payload']) => void;
}>({
  settings: settingsDefaultState,
  updateSettings: noop,
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const location = useLocation();

  const [settings, dispatchSettings] = useReducer(
    settingsReducer,
    getInitialState(settingsDefaultState, searchParams, prefersDarkMode)
  );

  const shouldUpdateSettings = useRef(false);
  const shouldUpdateSearchParams = useRef(true);

  const updateSettings = (payload: DeepPartial<SettingsState>) => {
    dispatchSettings({
      type: 'UPD',
      payload,
    });
  };

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));

    if (shouldUpdateSearchParams.current) {
      const oldSearchParams = searchParams.toString();
      if (location.pathname === '/shortcuts') return;

      if (location.pathname === '/') {
        searchParams.set('page', settings.home.page.toString());
        searchParams.set('perPage', settings.home.perPage.toString());
      }
      if (settings.general.q) searchParams.set('q', settings.general.q);
      else searchParams.delete('q');

      searchParams.set('currency', settings.general.currency);
      if (searchParams.toString() !== oldSearchParams) {
        setSearchParams(searchParams);
        shouldUpdateSettings.current = false;
      }
    } else shouldUpdateSearchParams.current = true;
  }, [settings, location.pathname]);

  useEffect(() => {
    if (shouldUpdateSettings.current) {
      updateSettings(mergeSearchParams(settings, searchParams));
      shouldUpdateSearchParams.current = false;
    } else shouldUpdateSettings.current = true;
  }, [searchParams]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

const getInitialState = (
  settingsInitState: SettingsState,
  searchParams: URLSearchParams,
  prefersDarkMode: boolean
) => {
  settingsInitState = deepMerge(settingsInitState, {
    general: { themeMode: prefersDarkMode ? 'dark' : 'light' },
  });

  const localStorageState = localStorage.getItem('settings');
  if (localStorageState) {
    let parsed;
    try {
      parsed = JSON.parse(localStorageState);
    } catch {
      parsed = null;
    }
    if (parsed) settingsInitState = deepMerge(settingsInitState, parsed);
  }
  return mergeSearchParams(settingsInitState, searchParams);
};

const mergeSearchParams = (settings: SettingsState, searchParams: URLSearchParams) => {
  const getSearchParamNumber = (name: string) => {
    const param = searchParams.get(name);
    if (param && !isNaN(parseInt(param))) return parseInt(param);
  };

  const currency = searchParams.get('currency') || undefined;
  const q = searchParams.get('q') || undefined;
  const page = getSearchParamNumber('page');
  const perPage = getSearchParamNumber('perPage');

  return deepMerge(settings, {
    general: { currency, q },
    home: { page, perPage },
  });
};
