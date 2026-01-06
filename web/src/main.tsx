import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Use createRoot directly since it's already imported
createRoot(document.getElementById('root')!).render(<App />);
