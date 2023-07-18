import { GeckoCoin } from '@/components/Search';
import { CustomError, fetchJson } from '@/utils';

export const CoinGeckoService = {
  search: async (input: string) => {
    const res = await fetchJson<{ coins: GeckoCoin[] }>(
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
