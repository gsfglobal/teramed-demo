import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { attachButtonGlow, startSmoothScroll } from './lib/motion';
import './styles/global.css';

startSmoothScroll();
attachButtonGlow();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
