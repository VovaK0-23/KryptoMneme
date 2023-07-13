import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { ErrorContext } from '@/contexts/ErrorContext';
import { StackAction, StackState } from '@/reducers/stackReducer';
import { CustomError } from '@/utils';

import { ErrorSnackbar } from './ErrorSnackbar';

describe('ErrorSnackbar', () => {
  test('should render null when there is no error', () => {
    const errorsDispatchMock = jest.fn();
    const contextValue = [{ last: null }, errorsDispatchMock] as unknown as [
      StackState<CustomError>,
      React.Dispatch<StackAction<CustomError>>
    ];

    render(
      <ErrorContext.Provider value={contextValue}>
        <ErrorSnackbar />
      </ErrorContext.Provider>
    );

    const errorSnackbar = screen.queryByRole('alert');

    expect(errorSnackbar).not.toBeInTheDocument();
    expect(errorsDispatchMock).not.toHaveBeenCalled();
  });

  test('should render error message when there is an error', () => {
    const errorsDispatchMock = jest.fn();
    const error = {
      id: 1,
      name: 'Test Error',
      type: 'default',
      message: 'Something went wrong',
    };
    const contextValue = [{ last: error }, errorsDispatchMock] as unknown as [
      StackState<CustomError>,
      React.Dispatch<StackAction<CustomError>>
    ];

    render(
      <ErrorContext.Provider value={contextValue}>
        <ErrorSnackbar />
      </ErrorContext.Provider>
    );

    const errorSnackbar = screen.getByRole('alert');
    const errorMessage = screen.getByText(/Something went wrong/);

    expect(errorSnackbar).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(errorsDispatchMock).not.toHaveBeenCalled();
  });

  test('should remove error when CloseIcon is clicked', async () => {
    const errorsDispatchMock = jest.fn();
    const error = {
      id: 1,
      name: 'Test Error',
      type: 'default',
      message: 'Something went wrong',
    };
    const contextValue = [{ last: error }, errorsDispatchMock] as unknown as [
      StackState<CustomError>,
      React.Dispatch<StackAction<CustomError>>
    ];

    render(
      <ErrorContext.Provider value={contextValue}>
        <ErrorSnackbar />
      </ErrorContext.Provider>
    );

    const closeIcon = screen.getByTestId('CloseIcon');
    await userEvent.click(closeIcon);

    expect(errorsDispatchMock).toHaveBeenCalledWith({ type: 'REMOVE' });
  });
});
