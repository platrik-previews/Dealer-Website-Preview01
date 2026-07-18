import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import css01 from './styles/part-01.css?raw';
import css02 from './styles/part-02.css?raw';
import css03 from './styles/part-03.css?raw';
import css04 from './styles/part-04.css?raw';
import css05 from './styles/part-05.css?raw';
import css06 from './styles/part-06.css?raw';
import css07a from './styles/part-07a.css?raw';
import css07b from './styles/part-07b.css?raw';
import css08 from './styles/part-08.css?raw';
import css09 from './styles/part-09.css?raw';
import css10 from './styles/part-10.css?raw';

// The stylesheet is stored in smaller GitHub-friendly fragments. Vite imports
// each fragment as text, then the browser parses the complete stylesheet once.
const style = document.createElement('style');
style.dataset.dealerMotionStyles = 'true';
style.textContent = [css01, css02, css03, css04, css05, css06, css07a, css07b, css08, css09, css10].join('\n');
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
