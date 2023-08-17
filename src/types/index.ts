export * from './result';
export * from './deepPartial';

export type Identifiable<T extends object> = T & { id: number };

export type KeysMatching<T, V> = keyof { [P in keyof T as T[P] extends V ? P : never]: P };
