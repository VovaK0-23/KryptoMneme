import { Close } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Snackbar, SnackbarCloseReason } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { ErrorContext } from '@/contexts/ErrorContext';

import { RequestErrorComponent } from './RequestErrorComponent';

export const ErrorSnackbar = () => {
  const { errors, dispatchError } = useContext(ErrorContext);

  const handleClose = useCallback((_: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;

    dispatchError({ type: 'REMOVE' });
  }, []);

  const handleCloseAll = useCallback(() => {
    dispatchError({ type: 'REMOVE_ALL' });
  }, []);

  if (!errors.last) return null;

  const { id, name, type, message } = errors.last;

  return (
    <Snackbar key={id} open={true} onClose={handleClose} autoHideDuration={15000}>
      <Alert
        severity='error'
        sx={{ width: '100%' }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {errors.all.length > 1 && (
              <Button onClick={handleCloseAll} color='inherit' sx={{ whiteSpace: 'nowrap' }}>
                Close All
              </Button>
            )}
            <IconButton onClick={handleClose} size='small' color='inherit'>
              <Close />
            </IconButton>
          </Box>
        }
      >
        #{id} {name}
        <br />
        {type === 'request_failed' ? <RequestErrorComponent error={errors.last} /> : message}
      </Alert>
    </Snackbar>
  );
};
