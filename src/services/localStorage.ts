import { PaletteMode } from '@mui/material';

export const localStorageService = {
  themeMode: {
    set: (mode: PaletteMode) => {
      localStorage.setItem('themeMode', mode);
    },
    get: (): PaletteMode | null => {
      return localStorage.getItem('themeMode') as PaletteMode | null;
    },
  },
  currentCurrency: {
    set: (currency: string) => {
      localStorage.setItem('currentCurrency', currency);
    },
    get: (): string | null => {
      return localStorage.getItem('currentCurrency');
    },
  },
};
