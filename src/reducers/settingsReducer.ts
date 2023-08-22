import { PriceScaleMode } from 'lightweight-charts';

import { DeepPartial } from '@/types';
import { deepMerge } from '@/utils';

export const settingsDefaultState = {
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

export type SettingsState = typeof settingsDefaultState;

export type UpdateSettingsAction = {
  type: 'UPD';
  payload: DeepPartial<SettingsState>;
};

export type SettingsAction = UpdateSettingsAction;

export const settingsReducer = (state: SettingsState, action: SettingsAction) => {
  switch (action.type) {
    case 'UPD': {
      return { ...deepMerge(state, action.payload) };
    }
  }
};
