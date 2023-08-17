import React, { ReactNode, createContext, useEffect, useReducer, useState } from 'react';

import { useLocation, useSearchParams } from 'react-router-dom';

import {
  SettingsState,
  UpdateAction,
  settingsInitState,
  settingsReducer,
} from '@/reducers/settingsReducer';
import { DeepPartial } from '@/types';
import { deepMerge } from '@/utils';

export const SettingsContext = createContext<{
  settings: SettingsState;
  updateSettings: (payload: UpdateAction['payload']) => void;
}>({
  settings: settingsInitState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [settings, dispatchSettings] = useReducer(
    settingsReducer,
    getInitialState(settingsInitState, searchParams)
  );

  const [shouldUpdateSettings, setShouldUpateSettings] = useState(false);
  const [shouldUpdateSearchParams, setShouldUpateSearchParams] = useState(true);

  const updateSettings = (payload: DeepPartial<SettingsState>) => {
    dispatchSettings({
      type: 'UPD',
      payload,
    });
  };

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));

    if (shouldUpdateSearchParams) {
      if (location.pathname === '/') {
        searchParams.set('page', settings.home.page.toString());
        searchParams.set('perPage', settings.home.perPage.toString());
      }
      if (settings.general.q) searchParams.set('q', settings.general.q);

      searchParams.set('currency', settings.general.currency);
      setSearchParams(searchParams);
      setShouldUpateSettings(false);
    } else setShouldUpateSearchParams(true);
  }, [settings]);

  useEffect(() => {
    if (shouldUpdateSettings) {
      updateSettings(mergeSearchParams(settings, searchParams));
      setShouldUpateSearchParams(false);
    } else setShouldUpateSettings(true);
  }, [searchParams]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

const getInitialState = (settingsInitState: SettingsState, searchParams: URLSearchParams) => {
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
