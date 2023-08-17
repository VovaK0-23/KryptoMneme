import React from 'react';

import { RouterProvider, createHashRouter } from 'react-router-dom';

import { Container } from '@mui/material';

import { ErrorElement } from '@/pages/ErrorElement';
import { Home } from '@/pages/Home';

import { Coin } from './pages/Coin/Coin';
import { Layout } from './pages/Layout/Layout';

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
