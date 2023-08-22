import { useEffect } from 'react';

export const useEffectOnKeyDown = (onKeyDown: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
};
