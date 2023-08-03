import React, { useContext, useEffect, useState } from 'react';

import { PriceScaleMode } from 'lightweight-charts';
import { useNavigate, useParams } from 'react-router-dom';

import { ExpandMore, FitScreenOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Container,
  Link,
  ToggleButton,
  Typography,
} from '@mui/material';

import { CurrencyContext } from '@/contexts/CurrencyContext';
import { ErrorContext } from '@/contexts/ErrorContext';

import { CandlestickChart } from '@/components/CandlestickChart';

import { CoinGeckoService, GeckoOhlcData } from '@/services/coingecko';

import { PriceScaleModeButtons } from './PriceScaleModeButtons';
import { TimeScaleDaysButtons } from './TimeScaleDaysButtons';

export const Coin = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { dispatchError } = useContext(ErrorContext);
  const { currentCurrency } = useContext(CurrencyContext);
  const [ohlcData, setOhlcData] = useState<GeckoOhlcData[]>([]);
  const [days, setDays] = useState('1');
  const [autoScale, setAutoScale] = useState(true);
  const [mode, setMode] = useState(PriceScaleMode.Normal);

  useEffect(() => {
    if (!coinId) return;

    (async () => {
      const res = await CoinGeckoService.ohlc(coinId, currentCurrency, days);
      if (res.ok) setOhlcData(res.data);
      else
        dispatchError({
          type: 'ADD',
          payload: res.error,
        });
    })();
  }, [days, currentCurrency]);

  if (!coinId) {
    return (
      <Container>
        <h1>Coin Id is not present in url *_*</h1>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumbs sx={{ my: 2 }} aria-label='breadcrumb'>
        <Link onClick={() => navigate('/')} underline='hover' color='inherit'>
          Home
        </Link>
        <Typography color='text.primary'>{coinId.toUpperCase()}</Typography>
      </Breadcrumbs>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>Price Chart</AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <PriceScaleModeButtons mode={mode} setMode={setMode} />

            <ToggleButton
              sx={{ mb: 2 }}
              size='small'
              value='check'
              selected={autoScale}
              title='Price auto scale'
              onChange={() => setAutoScale(!autoScale)}
            >
              <FitScreenOutlined />
            </ToggleButton>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <TimeScaleDaysButtons days={days} setDays={setDays} />

            <CandlestickChart
              data={ohlcData}
              autoScale={autoScale}
              setAutoScale={setAutoScale}
              mode={mode}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};
