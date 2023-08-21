import React from 'react';

import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';

import { GeckoSearchCoin } from '@/services/coingecko';

export const CoinNameWithThumb = (props: { coin: GeckoSearchCoin }) => {
  const { coin } = props;
  const { palette } = useTheme();

  return (
    <>
      <Box display='flex' alignItems='center'>
        <Paper
          elevation={2}
          sx={{ backgroundColor: alpha(palette.primary.main, 0.2), display: 'flex', p: 0.25 }}
        >
          <img src={coin.large} width='25px' height='25px' />
        </Paper>
        <Typography
          variant='body1'
          sx={{
            ml: 1,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: 'calc(100% - 25px)',
            wordBreak: 'break-word',
          }}
        >
          {coin.name}&nbsp;
          <Typography variant='caption' component='span'>
            ({coin.symbol})
          </Typography>
        </Typography>
      </Box>
    </>
  );
};
