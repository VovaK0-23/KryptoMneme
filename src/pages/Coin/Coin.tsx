import React, { useContext, useEffect, useState } from 'react';

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

import { ErrorContext } from '@/contexts/ErrorContext';
import { SettingsContext } from '@/contexts/SettingsContext';

import { CandlestickChart } from '@/components/CandlestickChart';
import { PriceScaleModeButtons } from '@/components/CandlestickChart';
import { TimeScaleDaysButtons } from '@/components/CandlestickChart';

import { CoinGeckoService, GeckoOhlcData } from '@/services/coingecko';

export const Coin = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { dispatchError } = useContext(ErrorContext);
  const [ohlcData, setOhlcData] = useState<GeckoOhlcData[]>([]);
  const {
    generalSettings: { currency },
    coinSettings: { days, priceAutoScale, priceScaleMode },
    updateSettings,
  } = useContext(SettingsContext);
  const updateCoinSettings = updateSettings('coin');

  useEffect(() => {
    if (!coinId) return;

    (async () => {
      const res = await CoinGeckoService.ohlc(coinId, currency, days);
      if (res.ok) setOhlcData(res.data);
      else
        dispatchError({
          type: 'ADD',
          payload: res.error,
        });
    })();
  }, [days, currency, coinId]);

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
            <PriceScaleModeButtons
              mode={priceScaleMode}
              setMode={(priceScaleMode) => updateCoinSettings({ priceScaleMode })}
            />

            <ToggleButton
              sx={{ mb: 2 }}
              size='small'
              value='check'
              selected={priceAutoScale}
              title='Price auto scale'
              onChange={() => updateCoinSettings({ priceAutoScale: !priceAutoScale })}
            >
              <FitScreenOutlined />
            </ToggleButton>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <TimeScaleDaysButtons days={days} setDays={(days) => updateCoinSettings({ days })} />

            <CandlestickChart
              data={ohlcData}
              autoScale={priceAutoScale}
              setAutoScale={(priceAutoScale) => updateCoinSettings({ priceAutoScale })}
              mode={priceScaleMode}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};
