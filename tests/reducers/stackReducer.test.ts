import { StackAction, StackState, stackInitState, stackReducerInit } from '@/reducers/stackReducer';

describe('stackReducerInit', () => {
  test('should handle ADD action', () => {
    const initId = 0;
    const reducer = stackReducerInit(initId);

    const testObject = { something: 'hello' };

    const initialState: StackState<typeof testObject> = stackInitState;
    const action: StackAction<typeof testObject> = {
      type: 'ADD',
      payload: testObject,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.all).toHaveLength(1);
    expect(nextState.all).toEqual([{ id: 1, ...testObject }]);
    expect(nextState.last).toEqual({ id: 1, ...testObject });
  });

  test('should handle REMOVE action', () => {
    const initId = 0;
    const reducer = stackReducerInit(initId);

    const testObject = { something: 'hello' };

    const initialState: StackState<typeof testObject> = {
      all: [{ id: 1, ...testObject }],
      last: { id: 1, ...testObject },
    };
    const action: StackAction<typeof testObject> = {
      type: 'REMOVE',
    };

    const nextState = reducer(initialState, action);

    expect(nextState.all).toHaveLength(0);
    expect(nextState.all).toEqual([]);
    expect(nextState.last).toBe(null);
  });
});
