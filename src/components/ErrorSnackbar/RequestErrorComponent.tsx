import { Box } from '@mui/material';
import React from 'react';

import { RequestError } from '@/utils';

export const RequestErrorComponent = ({ error }: { error: RequestError }) => (
  <>
    Status: {error.status}
    <br />
    {!!error.message.trim() && (
      <>
        Status Text: {error.message}
        <br />
      </>
    )}
    {typeof error.payload.error === 'string' ? (
      error.payload.error
    ) : (
      <Box
        component='pre'
        sx={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      >
        {JSON.stringify(error.payload, null, 2)}
      </Box>
    )}
  </>
);
