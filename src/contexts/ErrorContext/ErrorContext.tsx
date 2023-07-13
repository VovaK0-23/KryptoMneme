import React, { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react';

import { StackAction, StackState, stackInitState, stackReducerInit } from '@/reducers/stackReducer';
import { CustomError } from '@/utils';

export const ErrorContext = createContext<
  [StackState<CustomError>, Dispatch<StackAction<CustomError>>]
>([
  stackInitState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stackReducer = useMemo(() => stackReducerInit(0)<CustomError>, []);
  const reducer = useReducer(stackReducer, stackInitState);

  return <ErrorContext.Provider value={reducer}>{children}</ErrorContext.Provider>;
};
