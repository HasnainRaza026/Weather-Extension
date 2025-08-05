import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import ContentScript from './ContentScript';

const root = document.createElement('div');
root.id = '__weather_overlay';
document.body.append(root);

createRoot(root).render(
  <StrictMode>
    <ContentScript />
  </StrictMode>
);
