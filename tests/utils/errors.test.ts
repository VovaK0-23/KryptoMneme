import { CommonError, RequestError } from '@/utils/errors';

// Mock the console methods to prevent logging during tests
beforeAll(() => {
  console.group = jest.fn();
  console.error = jest.fn();
  console.info = jest.fn();
  console.groupEnd = jest.fn();
});

describe('CommonError', () => {
  test('should return a CommonError object with the correct properties', () => {
    const error = new Error('Test error');
    const commonError = CommonError(error, 'default');

    expect(commonError.type).toBe('default');
    expect(commonError.name).toBe('Error');
    expect(commonError.message).toBe('Test error');
    expect(commonError.stack).toContain('errors.test.ts');
  });

  test('should return a CommonError object for network_error', () => {
    const error = new Error('Test error');
    const commonError = CommonError(error, 'network_error');

    expect(commonError.type).toBe('network_error');
    expect(commonError.name).toBe('Network Error');
    expect(commonError.message).toBe(
      'Oops! Something went wrong while fetching the data. Please check your network connection and try again.'
    );
    expect(commonError.stack).toContain('errors.test.ts');
  });

  test('should return a CommonError object for parsing_error', () => {
    const error = new Error('Test error');
    const commonError = CommonError(error, 'parsing_error');

    expect(commonError.type).toBe('parsing_error');
    expect(commonError.name).toBe('JSON Parsing Error');
    expect(commonError.message).toBe(
      'Oops! We encountered an error while processing the data. Please refresh the page and try again. If the issue persists, contact developer'
    );
    expect(commonError.stack).toContain('errors.test.ts');
  });
});

describe('RequestError', () => {
  const mockPayload = { error: 'Something went wrong' };
  const mockResponse = {
    status: 404,
    statusText: 'Not Found',
    json: jest.fn().mockResolvedValue(mockPayload),
  } as unknown as Response;

  test('should return a RequestError object with the correct properties', async () => {
    const requestError = await RequestError(mockResponse);

    expect(requestError.type).toBe('request_failed');
    expect(requestError.name).toBe('Request Failed');
    expect(requestError.status).toBe(404);
    expect(requestError.message).toBe('Not Found');
    expect(requestError.payload).toEqual(mockPayload);
    expect(requestError.stack).toContain('errors.test.ts');
  });

  test('should return a RequestError object with payload when response.json() is successful', async () => {
    mockResponse.json = jest.fn().mockResolvedValue(mockPayload);

    const requestError = await RequestError(mockResponse);

    expect(requestError.payload).toBe(mockPayload);
  });

  test('should return a RequestError object without payload when response.json() throws an error', async () => {
    mockResponse.json = jest.fn().mockRejectedValue(new Error('JSON parsing error'));

    const requestError = await RequestError(mockResponse);

    expect(requestError.payload).toBe(undefined);
  });
});
