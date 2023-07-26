import React, { ReactNode, createContext } from 'react';

import { SetURLSearchParams, useSearchParams } from 'react-router-dom';

export const SearchParamsContext = createContext<{
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}>({
  searchParams: new URLSearchParams(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearchParams: () => {},
});

export const SearchParamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <SearchParamsContext.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </SearchParamsContext.Provider>
  );
};
