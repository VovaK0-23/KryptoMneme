export type SuccessRes<T> = ReturnType<typeof SuccessRes<T>>;
export const SuccessRes = <T>(data: T) => ({ ok: true as const, data });

export type ErrorRes<T> = ReturnType<typeof ErrorRes<T>>;
export const ErrorRes = <E>(error: E) => ({ ok: false as const, error });

export type Result<T, E> = SuccessRes<T> | ErrorRes<E>;
