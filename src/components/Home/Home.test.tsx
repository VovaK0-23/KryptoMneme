import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Home } from './Home';

describe('Home component', () => {
  test('renders the component with initial count and message', () => {
    const message = 'Hello, world!';
    render(<Home message={message} />);

    const messageElement = screen.getByText(message);
    expect(messageElement).toBeInTheDocument();

    const countElement = screen.getByText(/Count:/i);
    expect(countElement).toHaveTextContent('Count: 0');
  });

  test('increments the count when the button is clicked', async () => {
    render(<Home message='Test Message' />);

    const countElement = screen.getByText(/Count:/i);
    const incrementButton = screen.getByRole('button', { name: /Increment/i });

    expect(countElement).toHaveTextContent('Count: 0');

    await userEvent.click(incrementButton);
    expect(countElement).toHaveTextContent('Count: 1');
  });
});
