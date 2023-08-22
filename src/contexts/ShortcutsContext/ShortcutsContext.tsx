import React, { ReactNode, createContext, useEffect, useReducer } from 'react';

import { cloneDeep } from 'lodash';

import {
  ShortcutsState,
  UpdateShortcutsAction,
  shortcutsDefaultState,
  shortcutsReducer,
} from '@/reducers/shortcutsReducer';
import { DeepPartial } from '@/types';
import { deepMerge, noop } from '@/utils';

export const ShortcutsContext = createContext<{
  shortcuts: ShortcutsState;
  updateShortcuts: (payload: UpdateShortcutsAction['payload']) => void;
}>({
  shortcuts: shortcutsDefaultState,
  updateShortcuts: noop,
});

export const ShortcutsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shortcuts, dispatchShortcuts] = useReducer(
    shortcutsReducer,
    getInitialState(cloneDeep(shortcutsDefaultState))
  );

  const updateShortcuts = (payload: DeepPartial<ShortcutsState>) => {
    dispatchShortcuts({
      type: 'UPD',
      payload,
    });
  };

  useEffect(() => {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  return (
    <ShortcutsContext.Provider value={{ shortcuts, updateShortcuts }}>
      {children}
    </ShortcutsContext.Provider>
  );
};

const getInitialState = (shortcutsInitState: ShortcutsState) => {
  const localStorageState = localStorage.getItem('shortcuts');
  if (localStorageState) {
    let parsed;
    try {
      parsed = JSON.parse(localStorageState);
    } catch {
      parsed = null;
    }
    if (parsed) shortcutsInitState = deepMerge(shortcutsInitState, parsed);
  }
  return shortcutsInitState;
};
