import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { GeckoSearchCoin } from '@/services/coingecko';

import { noop } from '@/utils';

export const SearchCoinsContext = createContext<{
  setSearchCoins: Dispatch<SetStateAction<GeckoSearchCoin[]>>;
  searchCoins: GeckoSearchCoin[];
  setSearchLoading: Dispatch<SetStateAction<boolean>>;
  searchLoading: boolean;
}>({
  setSearchCoins: noop,
  searchCoins: [],
  setSearchLoading: noop,
  searchLoading: true,
});

export const SearchCoinsProvider = ({ children }: { children: ReactNode }) => {
  const [searchCoins, setSearchCoins] = useState<GeckoSearchCoin[]>([]);
  const [searchLoading, setSearchLoading] = useState(true);

  return (
    <SearchCoinsContext.Provider
      value={{ searchCoins, setSearchCoins, searchLoading, setSearchLoading }}
    >
      {children}
    </SearchCoinsContext.Provider>
  );
};
