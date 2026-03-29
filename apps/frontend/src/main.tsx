import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return <div>Procurement Frontend</div>;
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
