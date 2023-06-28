import './App';

if (NODE_ENV === 'development')
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload()
  );
