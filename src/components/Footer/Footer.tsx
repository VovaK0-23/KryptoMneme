import { GitHub, LinkedIn } from '@mui/icons-material';
import { AppBar, Box, Container, IconButton, Link, Typography, useTheme } from '@mui/material';
import React from 'react';

import cgLogoDark from '@/assets/cg_logo_dark.svg';
import cgLogoLight from '@/assets/cg_logo_light.svg';

export const Footer = () => {
  const theme = useTheme();

  return (
    <AppBar
      component='footer'
      sx={{ top: 'auto', bottom: 0, py: 2, mt: 1 }}
      position='relative'
      color='default'
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <IconButton component={Link} href='https://github.com/VovaK0-23' target='_blank'>
            <GitHub />
          </IconButton>
          <IconButton component={Link} href='https://www.linkedin.com/in/VovaK0/' target='_blank'>
            <LinkedIn />
          </IconButton>
        </Box>

        <Typography variant='body2' color='textSecondary'>
          &copy; {new Date().getFullYear()} Vova Kahramanov. All rights reserved.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='body1' color='textSecondary'>
            Powered by
          </Typography>
          <IconButton
            component={Link}
            disableRipple
            sx={{ display: 'flex' }}
            href='https://www.coingecko.com/en/api'
            underline='none'
            target='_blank'
          >
            <img
              src={theme.palette.mode === 'light' ? cgLogoDark : cgLogoLight}
              alt='CoinGecko api'
              height='30'
            />
          </IconButton>
        </Box>
      </Container>
    </AppBar>
  );
};
