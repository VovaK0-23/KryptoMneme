import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useEffectOnChange = (effect: EffectCallback, deps: DependencyList) => {
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      return effect();
    }
  }, deps);
};
