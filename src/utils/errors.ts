export type RequestError = Awaited<ReturnType<typeof RequestError>>;
export type CommonError = ReturnType<typeof CommonError>;
export type CustomError = RequestError | CommonError;

export const CommonError = <T extends 'default' | 'network_error' | 'parsing_error'>(
  error: Error,
  type: T
) => {
  const commonError = {
    type,
    name: '',
    message: '',
    stack: error.stack ?? getStackTrace(CommonError),
  };

  switch (type) {
    case 'network_error':
      commonError.name = 'Network Error';
      commonError.message =
        'Oops! Something went wrong while fetching the data. Please check your network connection and try again.';
      break;
    case 'parsing_error':
      commonError.name = 'JSON Parsing Error';
      commonError.message =
        'Oops! We encountered an error while processing the data. Please refresh the page and try again. If the issue persists, contact developer';
      break;
    default:
      commonError.name = error.name;
      commonError.message = error.message;
  }

  logError(commonError);
  return commonError;
};

export const RequestError = async (response: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;
  const error = {
    type: 'request_failed' as const,
    name: 'Request Failed',
    status: response.status,
    message: response.statusText,
    stack: getStackTrace(RequestError),
    payload,
  };
  try {
    error.payload = await response.json();
  } catch {
    error.payload = undefined;
  }
  logError(error);
  return error;
};

const getStackTrace = (constructor: (...args: never[]) => unknown): string | undefined => {
  const tmpErr = Error();
  Error.captureStackTrace(tmpErr, constructor);
  return tmpErr.stack;
};

const logError = (error: CustomError) => {
  console.group('Error:');
  console.error(error.stack);
  console.info('Error object:', error);
  console.groupEnd();
};
