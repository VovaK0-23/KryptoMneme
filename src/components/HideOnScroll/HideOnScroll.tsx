import React, { ReactElement } from 'react';

import { Slide, useScrollTrigger } from '@mui/material';

export const HideOnScroll = (props: { children: ReactElement }) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  );
};
