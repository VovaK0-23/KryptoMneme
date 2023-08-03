import React, { Dispatch, SetStateAction } from 'react';

import { PriceScaleMode } from 'lightweight-charts';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export const PriceScaleModeButtons = (props: {
  mode: PriceScaleMode;
  setMode: Dispatch<SetStateAction<PriceScaleMode>>;
}) => {
  const { mode, setMode } = props;

  const handleModeChange = (_: unknown, value: number | null) => {
    setMode(value ?? PriceScaleMode.Normal);
  };

  return (
    <ToggleButtonGroup
      sx={{ mb: 2 }}
      size='small'
      value={mode}
      exclusive
      onChange={handleModeChange}
    >
      <ToggleButton value={PriceScaleMode.Logarithmic}>Log</ToggleButton>
      <ToggleButton value={PriceScaleMode.Percentage}>(%)</ToggleButton>
      <ToggleButton value={PriceScaleMode.IndexedTo100}>100</ToggleButton>
    </ToggleButtonGroup>
  );
};
