import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event/';
import * as React from 'react';

import { clipboardCopy } from '@/utils';

import { ErrorBoundary } from './ErrorBoundary';

jest.mock('@/utils', () => {
  return {
    clipboardCopy: jest.fn(),
  };
});

describe('ErrorBoundary', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  const ChildComponentWithError = ({ error }: { error: Error }) => {
    throw error;
  };

  test('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );

    const childComponent = screen.getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
  });

  test('should render error message and stack trace when there is an error', () => {
    const error = new Error('Test Error');
    render(
      <ErrorBoundary>
        <ChildComponentWithError error={error} />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByText(/Oops! App crashed/);
    const [errorText] = screen.getAllByText(/Error: Test Error/);
    const stackTrace = screen.getByRole('region');

    expect(errorMessage).toBeInTheDocument();
    expect(errorText).toBeInTheDocument();
    expect(stackTrace).toBeInTheDocument();
  });

  test('should copy stack trace when clicking on the code element', async () => {
    const error = new Error('Test Error');
    render(
      <ErrorBoundary>
        <ChildComponentWithError error={error} />
      </ErrorBoundary>
    );

    const stackTrace = screen.getByRole('region');
    await userEvent.click(stackTrace);

    expect(clipboardCopy).toHaveBeenCalledWith(error.stack);
  });
});
