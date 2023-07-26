import { PaletteMode } from '@mui/material';

export const LStorageService = {
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
  searchQuery: {
    set: (q: string) => {
      localStorage.setItem('searchQuery', q);
    },
    get: (): string | null => {
      return localStorage.getItem('searchQuery');
    },
  },
  page: {
    set: (page: string) => {
      localStorage.setItem('page', page);
    },
    get: (): number | null => {
      const page = localStorage.getItem('page');
      return page ? parseInt(page) : null;
    },
  },
  perPage: {
    set: (perPage: string) => {
      localStorage.setItem('perPage', perPage);
    },
    get: (): number | null => {
      const perPage = localStorage.getItem('perPage');
      return perPage ? parseInt(perPage) : null;
    },
  },
};
