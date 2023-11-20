import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ChartOptions,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineData,
  MouseEventParams,
  PriceScaleMode,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';

import { List, ListItem, TableContainer, Tooltip, alpha, useTheme } from '@mui/material';

import { GeckoMarketChartData } from '@/services/coingecko';

import { DeepPartial } from '@/types';

export const LineChart = (props: {
  data: GeckoMarketChartData | null;
  autoScale: boolean;
  setAutoScale: (autoScale: boolean) => void;
  mode: PriceScaleMode;
}) => {
  const { data, autoScale, setAutoScale, mode } = props;
  const chartEl = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const line = useRef<ISeriesApi<'Line'> | null>(null);

  const [lineData, setLineData] = useState<(LineData & { time: UTCTimestamp }) | null>(null);

  const { palette } = useTheme();

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
    if (line.current) {
      const data = param.seriesData.get(line.current);
      if (data) setLineData(data as LineData & { time: UTCTimestamp });
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
    line.current = chart.current.addLineSeries({
      priceScaleId: 'right',
    });

    chart.current.subscribeCrosshairMove(subscribeHandler);

    return () => {
      chart.current?.unsubscribeCrosshairMove(subscribeHandler);
      if (line.current) chart.current?.removeSeries(line.current);
      chart.current?.remove();
    };
  }, []);

  useEffect(() => {
    chart.current?.applyOptions(chartTheme);
  }, [palette.mode]);

  useEffect(() => {
    line.current?.setData(
      data?.prices.map((value) => ({
        time: (value[0] / 1000) as UTCTimestamp,
        value: value[1],
      })) ?? []
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
          lineData && (
            <code>
              <List dense disablePadding>
                <ListItem disableGutters>price: {lineData.value}</ListItem>
                <ListItem disableGutters>
                  time:&nbsp;
                  {new Intl.DateTimeFormat(undefined, {
                    timeZone: 'UTC',
                    dateStyle: 'short',
                    timeStyle: 'long',
                    hour12: false,
                  })
                    .formatToParts(lineData.time * 1000)
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
