import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Autocomplete, Popper, TextField } from '@mui/material';
import { debounce } from '@mui/material/utils';

import { ErrorContext } from '@/contexts/ErrorContext';
import { SearchCoinsContext } from '@/contexts/SearchCoinsContext';
import { SettingsContext } from '@/contexts/SettingsContext';
import { ShortcutsContext } from '@/contexts/ShortcutsContext';

import { CoinNameWithThumb } from '@/components/CoinNameWithThumb';

import { CoinGeckoService, GeckoSearchCoin } from '@/services/coingecko';

import { useEffectOnKeyDown } from '@/hooks';
import { matchesShortcut } from '@/utils';

export const Search = () => {
  const { dispatchError } = useContext(ErrorContext);
  const { setSearchCoins, setSearchLoading } = useContext(SearchCoinsContext);
  const {
    generalSettings: { q },
    updateSettings,
  } = useContext(SettingsContext);
  const updateGeneralSettings = updateSettings('general');

  const { shortcuts } = useContext(ShortcutsContext);

  const [options, setOptions] = useState<GeckoSearchCoin[]>([]);

  const autocompleteRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleInputChange = (q: string) => {
    updateGeneralSettings({ q });
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
    }, 750),
    []
  );

  useEffect(() => {
    search(q);
  }, [q]);

  useEffectOnKeyDown((event) => {
    if (matchesShortcut(event, shortcuts.openSearch)) {
      event.preventDefault();
      autocompleteRef.current?.querySelector('input')?.focus();
    }
  });

  return (
    <>
      <Autocomplete
        ref={autocompleteRef}
        sx={{
          width: '50%',
        }}
        autoComplete
        freeSolo
        noOptionsText='No results'
        size='small'
        inputValue={q}
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
        onChange={(e, option) => {
          if (!option) return handleInputChange('');
          if (typeof option === 'string') return handleInputChange(option);

          handleInputChange(option.name);

          if ('shiftKey' in e && e['shiftKey']) navigate('/coin/' + option.id);
        }}
        componentsProps={{ clearIndicator: { onClick: () => handleInputChange('') } }}
        renderInput={(params) => <TextField {...params} label='Search...' fullWidth />}
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
