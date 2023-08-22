import React, { Dispatch, ReactNode, createContext, useMemo, useReducer } from 'react';

import { StackAction, StackState, stackInitState, stackReducerInit } from '@/reducers/stackReducer';
import { CustomError, noop } from '@/utils';

export const ErrorContext = createContext<{
  errors: StackState<CustomError>;
  dispatchError: Dispatch<StackAction<CustomError>>;
}>({
  errors: stackInitState,
  dispatchError: noop,
});

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stackReducer = useMemo(() => stackReducerInit(0)<CustomError>, []);
  const [errors, dispatchError] = useReducer(stackReducer, stackInitState);

  return (
    <ErrorContext.Provider value={{ errors, dispatchError }}>{children}</ErrorContext.Provider>
  );
};
