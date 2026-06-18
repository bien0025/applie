import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { TasksProvider } from './context/TasksContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ApplicationsProvider>
        <TasksProvider>
          <App />
        </TasksProvider>
      </ApplicationsProvider>
    </ThemeProvider>
  </StrictMode>
);
