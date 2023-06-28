import './App';

if (process.env.NODE_ENV === 'development')
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload()
  );
