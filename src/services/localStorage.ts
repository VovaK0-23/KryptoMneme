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
};
