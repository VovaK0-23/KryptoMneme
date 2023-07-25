import { Autocomplete, Popper, TextField } from '@mui/material';
import { debounce } from '@mui/material/utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ErrorContext } from '@/contexts/ErrorContext';
import { SearchCoinsContext } from '@/contexts/SearchCoinsContext';
import { CoinGeckoService, GeckoSearchCoin } from '@/services/coingecko';

import { CoinNameWithThumb } from '../CoinNameWithThumb';

export const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<GeckoSearchCoin[]>([]);
  const { dispatchError } = useContext(ErrorContext);
  const { setSearchCoins, setSearchLoading } = useContext(SearchCoinsContext);

  const search = useCallback(
    debounce(async (input: string) => {
      setSearchLoading(true);
      const res = await CoinGeckoService.search(input);
      if (res.ok) {
        const coins = res.data.coins;
        setSearchCoins([...coins]);
        coins.length = Math.min(coins.length, 100);
        setOptions(coins);
      } else {
        dispatchError({
          type: 'ADD',
          payload: res.error,
        });
      }
      setSearchLoading(false);
    }, 1000),
    []
  );

  useEffect(() => {
    search(inputValue);
  }, [inputValue]);

  return (
    <>
      <Autocomplete
        sx={{
          width: '50%',
        }}
        filterSelectedOptions
        freeSolo
        noOptionsText='No results'
        size='small'
        value={inputValue}
        options={options}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : `${option.name} ${option.symbol}`
        }
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(_, option) => {
          const name = typeof option === 'string' ? option : option?.name;
          setTimeout(() => {
            setInputValue(name ?? '');
          }, 0);
        }}
        renderInput={(params) => (
          <TextField {...params} color='secondary' label='Search...' fullWidth />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <CoinNameWithThumb coin={option} />
          </li>
        )}
        PopperComponent={(props) => <Popper {...props} sx={{ minWidth: '10rem' }} />}
      />
    </>
  );
};
