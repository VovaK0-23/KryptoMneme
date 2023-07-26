import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

// useEffectAfterRender executes the effect function after a specified number of renders.
export const useEffectAfterRender = (effect: EffectCallback, deps: DependencyList, times = 1) => {
  const renders = useRef(0);

  useEffect(() => {
    if (renders.current < times) {
      renders.current++;
    } else {
      return effect();
    }
  }, deps);
};
