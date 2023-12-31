import { DeepPartial } from '@/types';

export const deepMerge = <T extends object>(target: T, source: DeepPartial<T>) => {
  for (const k in source) {
    const key = k as keyof typeof source;
    const sourceValue = source[key];
    if (sourceValue !== undefined) {
      if (Array.isArray(sourceValue)) {
        target[key] = sourceValue as T[keyof T];
      } else if (sourceValue !== null && typeof sourceValue === 'object') {
        deepMerge(target[key], sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }
  return target;
};
