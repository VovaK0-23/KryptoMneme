import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { ErrorContext } from '@/contexts/ErrorContext';

import { RequestErrorComponent } from './RequestErrorComponent';

export const ErrorSnackbar = () => {
  const [{ last }, errorsDispatch] = useContext(ErrorContext);

  const handleClose = useCallback((_: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;

    errorsDispatch({ type: 'REMOVE' });
  }, []);

  if (!last) return null;

  const { id, name, type, message } = last;

  return (
    <Snackbar key={id} open={true} onClose={handleClose} autoHideDuration={15000}>
      <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
        {id} {name}
        <br />
        {type === 'request_failed' ? <RequestErrorComponent error={last} /> : message}
      </Alert>
    </Snackbar>
  );
};
