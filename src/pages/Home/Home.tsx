import React, { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  debounce,
} from '@mui/material';

import { ErrorContext } from '@/contexts/ErrorContext';
import { SearchCoinsContext } from '@/contexts/SearchCoinsContext';
import { SettingsContext } from '@/contexts/SettingsContext';

import { CoinRow } from '@/components/CoinRow';

import { CoinGeckoService, GeckoSearchCoin, GeckoSimplePriceCoin } from '@/services/coingecko';

import { useEffectAfterRender } from '@/hooks';

export const Home = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const { dispatchError } = useContext(ErrorContext);
  const { searchCoins, searchLoading } = useContext(SearchCoinsContext);
  const { perPage, page } = settings.home;
  const { currency } = settings.general;
  const perPageOptions = [5, 10, 25];

  const [coinsInfo, setCoinsInfo] = useState<Record<string, GeckoSimplePriceCoin>>({});

  const visibleCoins = useMemo(
    () => searchCoins.slice(page * perPage, page * perPage + perPage),
    [searchCoins, page, perPage]
  );

  const getPrice = useCallback(
    debounce(async (visibleCoins: GeckoSearchCoin[], currentCurrency: string) => {
      const res = await CoinGeckoService.simplePrice(
        visibleCoins.map((coin) => coin.id),
        currentCurrency
      );

      if (res.ok) setCoinsInfo(res.data);
      else dispatchError({ type: 'ADD', payload: res.error });
    }, 200),
    []
  );

  const handlePageChange = useCallback((_: unknown, page: number) => {
    updateSettings({ home: { page } });
  }, []);

  const handlePerPageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateSettings({ home: { perPage: +e.target.value } });
  }, []);

  useEffect(() => {
    if (visibleCoins.length > 0) getPrice(visibleCoins, currency);
  }, [visibleCoins, currency]);

  useEffectAfterRender(
    () => {
      updateSettings({ home: { page: 0 } });
    },
    [searchCoins, perPage],
    2
  );

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
            {visibleCoins.map((coin, idx) => (
              <CoinRow
                key={coin.id}
                coin={coin}
                idx={idx}
                coinsInfo={coinsInfo}
                perPage={perPage}
                perPageOptions={perPageOptions}
              />
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
