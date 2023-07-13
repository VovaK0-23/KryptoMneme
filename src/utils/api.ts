import { ErrorRes, Result, SuccessRes } from '@/types';
import { CommonError, CustomError, RequestError } from '@/utils';

export const fetchResult = async (
  url: string,
  options?: RequestInit
): Promise<Result<Response, CustomError>> => {
  try {
    const response = await fetch(url, options);

    if (response.ok) return SuccessRes(response);
    else {
      return ErrorRes(await RequestError(response));
    }
  } catch (err) {
    const errorType =
      err instanceof TypeError && err.message === 'Failed to fetch' ? 'network_error' : 'default';

    return ErrorRes(CommonError(err as Error, errorType));
  }
};

export const fetchJson = async <T extends object>(
  url: string,
  options?: RequestInit,
  formatError: (res: CustomError) => CustomError = (res) => res
): Promise<Result<T, CustomError>> => {
  const result = await fetchResult(url, {
    ...options,
    headers: {
      ...options?.headers,
      accept: 'application/json',
    },
  });

  if (result.ok) {
    try {
      return SuccessRes(await result.data.json());
    } catch (err) {
      return ErrorRes(CommonError(err as Error, 'parsing_error'));
    }
  } else return ErrorRes(formatError(result.error));
};
