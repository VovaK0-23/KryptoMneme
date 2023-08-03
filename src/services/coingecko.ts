import { CustomError, fetchJson } from '@/utils';

export type GeckoSearchCoin = {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
};

export type GeckoSimplePriceCoin = {
  price?: number;
  market_cap?: number;
  daily_vol?: number;
  daily_change?: number;
};

export type GeckoOhlcData = [number, number, number, number, number];

export const CoinGeckoService = {
  search: async (input: string) => {
    const res = await fetchJson<{ coins: GeckoSearchCoin[] }>(
      `https://api.coingecko.com/api/v3/search?query=${input}`,
      {
        method: 'GET',
      },
      formatErrors
    );
    return res;
  },
  supportedVsCurrencies: async () => {
    const res = await fetchJson<string[]>(
      `https://api.coingecko.com/api/v3/simple/supported_vs_currencies`,
      {
        method: 'GET',
      },
      formatErrors
    );
    return res;
  },
  simplePrice: async (ids: string[], currency: string) => {
    const obj = {
      ids: ids.join(','),
      vs_currencies: currency,
      include_market_cap: 'true',
      include_24hr_vol: 'true',
      include_24hr_change: 'true',
    };
    const params = new URLSearchParams(Object.entries(obj)).toString();

    const res = await fetchJson(
      `https://api.coingecko.com/api/v3/simple/price?${params}`,
      {
        method: 'GET',
      },
      formatErrors
    );

    if (res.ok) {
      res.data = Object.entries(res.data).reduce((coinsData, [name, data]) => {
        coinsData[name] = {
          price: data[currency],
          market_cap: data[`${currency}_market_cap`],
          daily_change: data[`${currency}_24h_change`],
          daily_vol: data[`${currency}_24h_vol`],
        };
        return coinsData;
      }, {} as Record<string, GeckoSimplePriceCoin>);

      return res as { ok: true; data: Record<string, GeckoSimplePriceCoin> };
    } else return res;
  },
  ohlc: async (id: string, currency: string, days: string) => {
    const res = await fetchJson<GeckoOhlcData[]>(
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`,
      { method: 'GET' },
      formatErrors
    );
    return res;
  },
};

const formatErrors = (res: CustomError): CustomError => {
  if (res.type === 'request_failed') {
    switch (res.status) {
      case 429: {
        res.payload = {
          error:
            "Oops! It seems like you've exceeded the Rate Limit of the Coingecko API. " +
            'Please wait for a minute and try again.',
        };
        break;
      }
    }
  }
  return res;
};
