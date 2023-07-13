import { Identifiable } from '@/types';

type AddAction<T> = {
  type: 'ADD';
  payload: T;
};

type RemoveAction = {
  type: 'REMOVE';
};

export type StackAction<T> = AddAction<T> | RemoveAction;

export type StackState<T extends object> = {
  last: Identifiable<T> | null;
  all: Identifiable<T>[];
};

export const stackInitState = {
  last: null,
  all: [],
};

export const stackReducerInit = (initId: number) => {
  let id = initId;

  return <T extends object>(state: StackState<T>, action: StackAction<T>): StackState<T> => {
    let last, all;

    switch (action.type) {
      case 'ADD':
        last = { id: ++id, ...action.payload };

        return {
          all: [...state.all, last],
          last,
        };
      case 'REMOVE':
        if (state.all.length <= 1) {
          id = initId;
          return stackInitState;
        }

        all = state.all.slice(0, -1);
        last = all[all.length - 1] ?? null;

        return {
          all,
          last,
        };
      default:
        return state;
    }
  };
};
