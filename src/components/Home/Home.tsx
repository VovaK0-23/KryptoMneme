import { Box, Container, Toolbar } from '@mui/material';
import React, { useCallback, useState } from 'react';

export const Home = (props: { message: string }) => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((count) => count + 1);
  }, [count]);

  return (
    <>
      <Toolbar />
      <Container>
        <Box>
          <h1>{props.message}</h1>
          <h2>Count: {count}</h2>
          <button onClick={increment}>Increment</button>
        </Box>
      </Container>
    </>
  );
};