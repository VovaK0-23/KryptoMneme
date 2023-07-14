import { Autocomplete, Grid, TextField } from '@mui/material';
import { debounce } from '@mui/material/utils';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ErrorContext } from '@/contexts/ErrorContext';
import { CoinGeckoService } from '@/services/coingecko';

export type GeckoCoin = {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
};

export const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly GeckoCoin[]>([]);
  const [, errorsDispatch] = useContext(ErrorContext);

  const search = useCallback(
    debounce(async (input: string) => {
      const res = await CoinGeckoService.search(input);
      if (res.ok) {
        const coins = res.data.coins;
        coins.length = Math.min(coins.length, 100);
        setOptions(coins);
      } else {
        errorsDispatch({
          type: 'ADD',
          payload: res.error,
        });
      }
    }, 1000),
    []
  );

  useEffect(() => {
    search(inputValue);
  }, [inputValue]);

  return (
    <>
      <Autocomplete
        autoHighlight
        filterSelectedOptions
        freeSolo
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : `${option.name} ${option.symbol}`
        }
        noOptionsText='No results'
        options={options}
        limitTags={50}
        size='small'
        sx={{ width: '50%' }}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        value={inputValue}
        onChange={(_, option) => {
          const name = typeof option === 'string' ? option : option?.name;
          if (name) setInputValue(name);
        }}
        renderInput={(params) => (
          <TextField {...params} color='secondary' label='Search...' fullWidth />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              <Grid container alignItems='center'>
                <Grid item sx={{ display: 'flex', width: 44 }}>
                  <img src={option.thumb} />
                </Grid>
                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                  {option.name}
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </>
  );
};
