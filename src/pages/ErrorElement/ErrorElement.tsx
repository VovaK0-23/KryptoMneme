import React, { useEffect, useRef, useState } from 'react';

import { useRouteError } from 'react-router-dom';

import { Alert, Container } from '@mui/material';

import { clipboardCopy } from '@/utils';

export const ErrorElement = () => {
  const error = useRouteError();
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const message = (
    <p>
      Oops! App crashed ¯\_(ツ)_/¯. Please try reloading the page. If the issue persists, please
      notify the developer.
    </p>
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleCopyClick = () => {
    if (codeRef.current) {
      const text = codeRef.current.textContent;

      if (text) {
        clipboardCopy(text);
        setCopied(true);
      }
    }
  };

  return (
    <Container>
      <Alert severity='error'>
        {message}
        {error instanceof Error ? (
          <div>
            <p>Error: {error.message}</p>
            <p>
              To help resolve the issue, please copy the stack trace below and share it with the
              developer along with a brief description of what you were doing when the error
              occurred. Thank you for your cooperation!
            </p>
            <p>{copied ? 'Successfuly copied!' : 'Click text to copy:'}</p>
            <pre>
              <code
                role='region'
                style={{ cursor: 'pointer' }}
                onClick={handleCopyClick}
                ref={codeRef}
              >
                {error.stack}
              </code>
            </pre>
          </div>
        ) : (
          <p>Error of unknown type logged in console</p>
        )}
      </Alert>
    </Container>
  );
};
