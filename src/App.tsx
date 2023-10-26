import React from 'react';

import { RouterProvider, createHashRouter } from 'react-router-dom';

import { Container } from '@mui/material';

import { ShortcutsModal } from '@/components/modals/ShortcutsModal';

import { Coin } from '@/pages/Coin';
import { ErrorElement } from '@/pages/ErrorElement';
import { Home } from '@/pages/Home';
import { Layout } from '@/pages/Layout';

const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/coin/:coinId',
        element: <Coin />,
      },
      {
        path: '/shortcuts',
        element: <ShortcutsModal />,
      },
      {
        path: '*',
        element: (
          <Container>
            <h1>Page Not Found 404 *_*</h1>
          </Container>
        ),
      },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
