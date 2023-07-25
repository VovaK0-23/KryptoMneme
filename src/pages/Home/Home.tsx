import {
  Container,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useCallback, useContext, useMemo, useState } from 'react';

import { CoinNameWithThumb } from '@/components/CoinNameWithThumb';
import { NumberFieldCell } from '@/components/NumberFieldCell/NumberFieldCell';
import { CurrencyContext } from '@/contexts/CurrencyContext';
import { ErrorContext } from '@/contexts/ErrorContext';
import { SearchCoinsContext } from '@/contexts/SearchCoinsContext';
import { useEffectOnChange } from '@/hooks';
import { CoinGeckoService, GeckoSearchCoin, GeckoSimplePriceCoin } from '@/services/coingecko';
import { findOppositeElement } from '@/utils';

export const Home = () => {
  const theme = useTheme();
  const { searchCoins, searchLoading } = useContext(SearchCoinsContext);
  const { currentCurrency } = useContext(CurrencyContext);
  const { dispatchError } = useContext(ErrorContext);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [coinsInfo, setCoinsInfo] = useState<Record<string, GeckoSimplePriceCoin>>({});
  const perPageOptions = [5, 10, 25];

  const visibleCoins = useMemo(() => {
    return searchCoins.slice(page * perPage, page * perPage + perPage);
  }, [searchCoins, page, perPage]);

  const getPrice = useCallback(async (visibleCoins: GeckoSearchCoin[], currentCurrency: string) => {
    const res = await CoinGeckoService.simplePrice(
      visibleCoins.map((coin) => coin.id),
      currentCurrency
    );

    if (res.ok) setCoinsInfo(res.data);
    else dispatchError({ type: 'ADD', payload: res.error });
  }, []);

  const handlePageChange = useCallback((_: unknown, page: number) => {
    setPage(page);
  }, []);

  const handlePerPageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPerPage(+e.target.value);
  }, []);

  useEffectOnChange(() => {
    setPage(0);
  }, [searchCoins, perPage]);

  useEffectOnChange(() => {
    getPrice(visibleCoins, currentCurrency);
  }, [visibleCoins, currentCurrency]);

  return (
    <Container>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>#</TableCell>
              <TableCell sx={{ minWidth: '10rem' }}>Coin</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='right'>24h Price</TableCell>
              <TableCell align='right'>24h Volume</TableCell>
              <TableCell align='right'>Mkt Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleCoins.map((coin, i) => (
              <Fade
                key={coin.id}
                in={true}
                style={{
                  transitionDelay: `${i * findOppositeElement(perPage, perPageOptions)}ms`,
                }}
              >
                <TableRow hover>
                  <TableCell align='center'>{coin.market_cap_rank}</TableCell>
                  <TableCell>
                    <CoinNameWithThumb coin={coin} />
                  </TableCell>
                  <NumberFieldCell
                    info={coinsInfo[coin.id]}
                    field='price'
                    format={
                      Intl.NumberFormat(undefined, {
                        maximumFractionDigits: 20,
                      }).format
                    }
                  />
                  <NumberFieldCell
                    info={coinsInfo[coin.id]}
                    field='daily_change'
                    format={(info) => (
                      <Typography
                        color={
                          info === 0
                            ? theme.palette.text.primary
                            : info > 0
                            ? theme.palette.success.main
                            : theme.palette.error.main
                        }
                        variant='body2'
                      >
                        {info.toFixed(2)}%
                      </Typography>
                    )}
                  />
                  <NumberFieldCell info={coinsInfo[coin.id]} field='daily_vol' />
                  <NumberFieldCell info={coinsInfo[coin.id]} field='market_cap' />
                </TableRow>
              </Fade>
            ))}
            {searchLoading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <Typography variant='body1'>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleCoins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    <Typography variant='body1'>No results found.</Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          },
        }}
        rowsPerPageOptions={perPageOptions}
        component='div'
        count={searchCoins.length}
        rowsPerPage={perPage}
        page={page}
        showFirstButton
        showLastButton
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePerPageChange}
      />
    </Container>
  );
};
