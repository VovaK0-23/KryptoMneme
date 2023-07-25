import { Skeleton, TableCell } from '@mui/material';
import React, { ReactNode } from 'react';

import { KeysMatching } from '@/types';

export const NumberFieldCell = <T extends object>(props: {
  info: T | undefined;
  field: KeysMatching<T, number | undefined>;
  format: (num: number) => ReactNode;
}) => {
  const { info, field, format } = props;

  let formattedValue;
  if (info) {
    const number = info[field as keyof T];
    if (typeof number === 'number') formattedValue = format(number);
    else formattedValue = 'N/A';
  } else formattedValue = <Skeleton />;

  return <TableCell align='right'>{formattedValue}</TableCell>;
};

NumberFieldCell.defaultProps = {
  format: Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format,
};
