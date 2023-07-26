import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Fade, TableCell, TableRow, Typography, useTheme } from '@mui/material';

import { CoinNameWithThumb } from '@/components/CoinNameWithThumb';
import { NumberFieldCell } from '@/components/NumberFieldCell/NumberFieldCell';

import { GeckoSearchCoin, GeckoSimplePriceCoin } from '@/services/coingecko';

import { findOppositeElement } from '@/utils';

export const CoinRow = (props: {
  coin: GeckoSearchCoin;
  idx: number;
  coinsInfo: Record<string, GeckoSimplePriceCoin>;
  perPage: number;
  perPageOptions: number[];
}) => {
  const { coin, idx, coinsInfo, perPage, perPageOptions } = props;
  const coinInfo = coinsInfo[coin.id];
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Fade
      in={true}
      style={{
        transitionDelay: `${idx * findOppositeElement(perPage, perPageOptions)}ms`,
      }}
    >
      <TableRow hover onClick={() => navigate(coin.id)}>
        <TableCell align='center'>{coin.market_cap_rank}</TableCell>
        <TableCell>
          <CoinNameWithThumb coin={coin} />
        </TableCell>
        <NumberFieldCell
          info={coinInfo}
          field='price'
          format={
            Intl.NumberFormat(undefined, {
              maximumFractionDigits: 20,
            }).format
          }
        />
        <NumberFieldCell
          info={coinInfo}
          field='daily_change'
          format={(num) => (
            <Typography
              color={
                num === 0
                  ? theme.palette.text.primary
                  : num > 0
                  ? theme.palette.success.main
                  : theme.palette.error.main
              }
              variant='body2'
            >
              {num.toFixed(2)}%
            </Typography>
          )}
        />
        <NumberFieldCell info={coinInfo} field='daily_vol' />
        <NumberFieldCell info={coinInfo} field='market_cap' />
      </TableRow>
    </Fade>
  );
};
