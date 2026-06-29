import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { TasksProvider } from './context/TasksContext';
import { ResumesProvider } from './context/ResumesContext';
import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
                  <Analytics />

    <ThemeProvider>
      <AuthProvider>
        <ApplicationsProvider>
          <TasksProvider>
            <ResumesProvider>
              <App />

            </ResumesProvider>
          </TasksProvider>
        </ApplicationsProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
