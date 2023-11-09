import { createElement } from 'react';

import { createRoot } from 'react-dom/client';

import { App } from '@/App';
import '@/styles/index.scss';

const rootElem = document.getElementById('root');

if (rootElem) createRoot(rootElem).render(createElement(App));
else alert('Cannot find element with id "root", something went wrong');

if (NODE_ENV === 'development') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload());
}
