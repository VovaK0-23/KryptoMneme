import { Autocomplete, Grid, TextField } from '@mui/material';
import React from 'react';

export const Search = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly string[]>(['BTC', 'ETC']);

  return (
    <Autocomplete
      sx={{ width: '50%' }}
      size='small'
      getOptionLabel={(option) => option}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText='No results'
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} variant='standard' color='secondary' label='Search...' fullWidth />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems='center'>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {option}
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};
