import { ErrorRes, SuccessRes } from '@/types';
import { fetchResult } from '@/utils/api';
import { CommonError, RequestError } from '@/utils/errors';

describe('fetchResult', () => {
  beforeAll(() => {
    console.error = jest.fn();
    console.info = jest.fn();
    console.group = jest.fn();
    console.groupEnd = jest.fn();
  });

  it('should return a successful response', async () => {
    window.fetch = jest.fn().mockResolvedValue({ ok: true });
    const result = (await fetchResult('/success')) as SuccessRes<Response>;

    expect(result.ok).toBe(true);
    expect(result.data.ok).toBe(true);
  });

  it('should return a failed response with error details', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      ok: false,
      body: true,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => Promise.resolve({ error: 'Failure response' }),
    });
    const { error } = (await fetchResult('/failure')) as ErrorRes<RequestError>;

    expect(error.type).toBe('request_failed');
    expect(error.name).toBe('Request Failed');
    expect(error.message).toBe('Bad Request');
    expect(error.status).toBe(400);
    expect(error.payload).toEqual({ error: 'Failure response' });
    expect(error.stack).toEqual(expect.any(String));
  });

  it('should return a network error with error details', async () => {
    window.fetch = jest.fn().mockImplementation(() => {
      throw new TypeError('Failed to fetch');
    });
    const { error } = (await fetchResult('/error')) as ErrorRes<CommonError>;

    expect(error.type).toBe('network_error');
    expect(error.name).toBe('Network Error');
    expect(error.message).toBe(
      'Oops! Something went wrong while fetching the data. Please check your network connection and try again.'
    );
    expect(error.stack).toEqual(expect.any(String));
  });

  it('should log the error details', async () => {
    expect(console.group).toHaveBeenCalledWith('Error:');
    expect(console.error).toHaveBeenCalledWith(expect.any(String));
    expect(console.info).toHaveBeenCalledWith('Error object:', expect.any(Object));
    expect(console.groupEnd).toHaveBeenCalled();
  });
});
