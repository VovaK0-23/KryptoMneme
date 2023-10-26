import * as React from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/';

import { ErrorElement } from '@/pages/ErrorElement';

import { clipboardCopy } from '@/utils';

jest.mock('@/utils', () => {
  return {
    clipboardCopy: jest.fn(),
  };
});

describe('ErrorBoundary', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  const error = new Error('Test Error');

  const ChildComponentWithError = () => {
    throw error;
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <ChildComponentWithError />,
      errorElement: <ErrorElement />,
    },
  ]);

  test('should render error message and stack trace when there is an error', () => {
    render(<RouterProvider router={router} />);

    const errorMessage = screen.getByText(/Oops! App crashed/);
    const [errorText] = screen.getAllByText(/Error: Test Error/);
    const stackTrace = screen.getByRole('region');

    expect(errorMessage).toBeInTheDocument();
    expect(errorText).toBeInTheDocument();
    expect(stackTrace).toBeInTheDocument();
  });

  test('should copy stack trace when clicking on the code element', async () => {
    render(<RouterProvider router={router} />);

    const stackTrace = screen.getByRole('region');
    await userEvent.click(stackTrace);

    expect(clipboardCopy).toHaveBeenCalledWith(error.stack);
  });
});
