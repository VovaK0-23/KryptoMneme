import { Button, Menu, MenuItem } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';

export const CurrencySelector = (props: {
  currentCurrency: string;
  currencies: string[];
  onChange: (currency: string) => void;
}) => {
  const { currencies, currentCurrency, onChange } = props;
  const btn = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleChange = useCallback((currency: string) => {
    onChange(currency);
    setOpen(false);
  }, []);

  return (
    <>
      <Button color='secondary' ref={btn} onClick={handleOpen}>
        {currentCurrency.toUpperCase()}
      </Button>
      <Menu open={open} anchorEl={btn.current} onClose={handleClose}>
        {currencies.map((currency) => (
          <MenuItem key={currency} onClick={() => handleChange(currency)}>
            {currency.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
