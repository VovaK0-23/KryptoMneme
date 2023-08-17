import React from 'react';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export const TimeScaleDaysButtons = (props: { days: string; setDays: (days: string) => void }) => {
  const { days, setDays } = props;

  const handleDaysChange = (_: unknown, value: string | null) => {
    if (value) setDays(value);
  };

  return (
    <ToggleButtonGroup
      orientation='vertical'
      sx={{ mr: 1 }}
      size='small'
      value={days}
      exclusive
      onChange={handleDaysChange}
    >
      <ToggleButton value='1'>1d</ToggleButton>
      <ToggleButton value='7'>1w</ToggleButton>
      <ToggleButton value='14'>2w</ToggleButton>
      <ToggleButton value='30'>1m</ToggleButton>
      <ToggleButton value='90'>3m</ToggleButton>
      <ToggleButton value='180'>180d</ToggleButton>
      <ToggleButton value='365'>1y</ToggleButton>
      <ToggleButton value='max'>Max</ToggleButton>
    </ToggleButtonGroup>
  );
};
