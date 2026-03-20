import { createRoot } from 'react-dom/client';
import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from '@/components/ui/error-boundary';
// import './debug-env';
import '@/services/supabasePhonesService'; // Ensure service is loaded for console access

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <div className="animate-pulse text-primary text-lg font-medium">Loading Mobizilla...</div>
              <div className="text-sm text-muted-foreground mt-2">Please wait</div>
            </div>
          </div>
        }>
          <App />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
