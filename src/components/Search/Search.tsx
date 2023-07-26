import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Autocomplete, Popper, TextField } from '@mui/material';
import { debounce } from '@mui/material/utils';

import { ErrorContext } from '@/contexts/ErrorContext';
import { SearchCoinsContext } from '@/contexts/SearchCoinsContext';
import { SearchParamsContext } from '@/contexts/SearchParamsContext';

import { CoinGeckoService, GeckoSearchCoin } from '@/services/coingecko';
import { LStorageService } from '@/services/localStorage';

import { useEffectAfterRender } from '@/hooks';

import { CoinNameWithThumb } from '../CoinNameWithThumb';

export const Search = () => {
  const { dispatchError } = useContext(ErrorContext);
  const { searchParams, setSearchParams } = useContext(SearchParamsContext);
  const { setSearchCoins, setSearchLoading } = useContext(SearchCoinsContext);

  const [inputValue, setInputValue] = useState(
    searchParams.get('q') ?? LStorageService.searchQuery.get() ?? ''
  );
  const [options, setOptions] = useState<GeckoSearchCoin[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (input: string) => {
    searchParams.set('q', input);
    setSearchParams(searchParams);
    LStorageService.searchQuery.set(input);
    setInputValue(input);
  };

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

  useEffect(() => {
    if (inputValue) {
      searchParams.set('q', inputValue);
      setSearchParams(searchParams);
    }
  }, [location.pathname]);

  useEffectAfterRender(() => {
    setInputValue(searchParams.get('q') ?? '');
  }, [searchParams.get('q')]);

  return (
    <>
      <Autocomplete
        sx={{
          width: '50%',
        }}
        autoComplete
        freeSolo
        noOptionsText='No results'
        size='small'
        inputValue={inputValue}
        options={options}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        filterOptions={(options, { inputValue }) => {
          const inputValueLowerCase = inputValue.toLowerCase();
          return options.filter(
            (option) =>
              option.name.toLowerCase().includes(inputValueLowerCase) ||
              option.symbol.toLowerCase().includes(inputValueLowerCase)
          );
        }}
        onInputChange={(e, newInputValue) => {
          if (e && e.type === 'change') handleInputChange(newInputValue);
        }}
        onChange={(_, option) => {
          if (!option) return handleInputChange('');
          if (typeof option === 'string') return handleInputChange(option);

          handleInputChange(option.name);
          navigate('/coin/' + option.id);
        }}
        componentsProps={{ clearIndicator: { onClick: () => handleInputChange('') } }}
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
