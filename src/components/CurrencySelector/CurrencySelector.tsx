import React, { useCallback, useContext, useRef, useState } from 'react';

import { Button, Menu, MenuItem } from '@mui/material';

import { CurrencyContext } from '@/contexts/CurrencyContext';

export const CurrencySelector = () => {
  const { currencies, currentCurrency, changeCurrentCurrency } = useContext(CurrencyContext);
  const [open, setOpen] = useState(false);

  const btn = useRef<HTMLButtonElement>(null);

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleChange = useCallback((currency: string) => {
    changeCurrentCurrency(currency);
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
