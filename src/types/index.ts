export * from './result';

export type Identifiable<T extends object> = T & { id: number };
