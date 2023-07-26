import React from 'react';

import { useParams } from 'react-router-dom';

export const Coin = () => {
  const { coinId } = useParams();

  return <>{coinId}</>;
};
