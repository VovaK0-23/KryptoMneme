import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  CandlestickStyleOptions,
  ChartOptions,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  OhlcData,
  PriceScaleMode,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';

import { List, ListItem, TableContainer, Tooltip, alpha } from '@mui/material';
import { useTheme } from '@mui/material';

export const CandlestickChart = (props: {
  data: [number, number, number, number, number][];
  autoScale: boolean;
  setAutoScale: (autoScale: boolean) => void;
  mode: PriceScaleMode;
}) => {
  const { data, autoScale, setAutoScale, mode } = props;

  const chartEl = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const candlestick = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [candlestickData, setCandlestickData] = useState<
    (OhlcData & { time: UTCTimestamp }) | null
  >(null);
  const { palette } = useTheme();

  const candlestickTheme: DeepPartial<CandlestickStyleOptions> = useMemo(
    () => ({
      upColor: palette.success.main,
      downColor: palette.error.main,
      borderDownColor: palette.error.main,
      borderUpColor: palette.success.main,
      wickDownColor: palette.error.main,
      wickUpColor: palette.success.main,
    }),
    [palette.mode]
  );

  const chartTheme: DeepPartial<ChartOptions> = useMemo(
    () => ({
      layout: {
        background: {
          color: 'transparent',
        },
        textColor: palette.text.secondary,
      },
      grid: {
        vertLines: {
          color: alpha(palette.primary.main, 0.5),
        },
        horzLines: {
          color: alpha(palette.primary.main, 0.6),
        },
      },
      rightPriceScale: {
        borderColor: palette.text.secondary,
        textColor: palette.text.secondary,
      },
      timeScale: {
        borderColor: palette.text.secondary,
      },
    }),
    [palette.mode]
  );

  const subscribeHandler = useCallback((param: MouseEventParams) => {
    if (candlestick.current) {
      const data = param.seriesData.get(candlestick.current);
      if (data) setCandlestickData(data as OhlcData & { time: UTCTimestamp });
    }
  }, []);

  useEffect(() => {
    const container = chartEl.current;
    if (!container) return;

    chart.current = createChart(container, {
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
      localization: {
        timeFormatter: (time: number, _: unknown, locale: string) => {
          const date = new Date(time * 1000); // Convert Unix timestamp to milliseconds

          return new Intl.DateTimeFormat(locale, {
            timeStyle: 'short',
            dateStyle: 'medium',
          }).format(date);
        },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      timeScale: {
        fixLeftEdge: true,
      },
      autoSize: true,
    });
    candlestick.current = chart.current.addCandlestickSeries({
      priceScaleId: 'right',
    });

    chart.current.subscribeCrosshairMove(subscribeHandler);

    return () => {
      chart.current?.unsubscribeCrosshairMove(subscribeHandler);
      if (candlestick.current) chart.current?.removeSeries(candlestick.current);
      chart.current?.remove();
    };
  }, []);

  useEffect(() => {
    chart.current?.applyOptions(chartTheme);
    candlestick.current?.applyOptions(candlestickTheme);
  }, [palette.mode]);

  useEffect(() => {
    candlestick.current?.setData(
      data.map((value) => ({
        time: (value[0] / 1000) as UTCTimestamp,
        open: value[1],
        high: value[2],
        low: value[3],
        close: value[4],
      }))
    );
    chart.current?.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    chart.current?.priceScale('right').applyOptions({ autoScale });

    const listener = () => {
      const autoScaleOption = chart.current?.priceScale('right').options().autoScale;
      if (autoScaleOption !== undefined) setAutoScale(autoScaleOption);
    };
    chartEl.current?.addEventListener('click', listener);

    return () => chartEl.current?.removeEventListener('click', listener);
  }, [autoScale, data]);

  useEffect(() => {
    chart.current?.priceScale('right').applyOptions({ mode });
  }, [mode]);

  return (
    <TableContainer>
      <Tooltip
        followCursor
        placement='bottom-start'
        title={
          candlestickData && (
            <code>
              <List dense disablePadding>
                <ListItem disableGutters>o: {candlestickData.open}</ListItem>
                <ListItem disableGutters>h: {candlestickData.high}</ListItem>
                <ListItem disableGutters>l: {candlestickData.low}</ListItem>
                <ListItem disableGutters>c: {candlestickData.close}</ListItem>
                <ListItem disableGutters>
                  t:&nbsp;
                  {new Intl.DateTimeFormat(undefined, {
                    timeZone: 'UTC',
                    dateStyle: 'short',
                    timeStyle: 'long',
                    hour12: false,
                  })
                    .formatToParts(candlestickData.time * 1000)
                    .map((e, i) =>
                      i === 5 ? (
                        <Fragment key=''>
                          <br />
                          &nbsp; &nbsp;
                        </Fragment>
                      ) : (
                        e.value
                      )
                    )}
                </ListItem>
              </List>
            </code>
          )
        }
      >
        <div ref={chartEl} style={{ width: '100%', height: '20rem' }} />
      </Tooltip>
    </TableContainer>
  );
};
