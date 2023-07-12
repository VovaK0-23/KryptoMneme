import { Alert, Container } from '@mui/material';
import React, { ReactNode, RefObject, createRef } from 'react';

import { clipboardCopy } from '@/utils';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundryState = {
  error: Error | null;
  codeRef: RefObject<HTMLElement>;
  copied: boolean;
};
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, codeRef: createRef<HTMLElement>(), copied: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  handleCopyClick = () => {
    if (this.state.codeRef.current) {
      const text = this.state.codeRef.current.textContent;

      if (text) {
        clipboardCopy(text);
        this.setState((state) => ({ ...state, copied: true }));
      }
    }
  };

  render() {
    if (this.state.error) {
      return (
        <Container>
          <Alert severity='error'>
            <p>
              Oops! App crashed ¯\_(ツ)_/¯. Please try reloading the page. If the issue persists,
              please notify the developer.
            </p>
            <div>
              <p>Error: {this.state.error.message}</p>
              <p>
                To help resolve the issue, please copy the stack trace below and share it with the
                developer along with a brief description of what you were doing when the error
                occurred. Thank you for your cooperation!
              </p>
              <p>{this.state.copied ? 'Successfuly copied!' : 'Click text to copy:'}</p>
              <pre>
                <code
                  role='region'
                  style={{ cursor: 'pointer' }}
                  onClick={this.handleCopyClick}
                  ref={this.state.codeRef}
                >
                  {this.state.error.stack}
                </code>
              </pre>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}
