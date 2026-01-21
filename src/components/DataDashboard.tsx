// components/DataDashboard.tsx
import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const LazyChart = lazy(() => import('./Chart'));
const LazyTable = lazy(() => import('./Table'));

interface DataDashboardProps {
  userId: string;
}

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <div className="error-container">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading data...</p>
  </div>
);

export const DataDashboard: React.FC<DataDashboardProps> = ({ userId }) => {
  return (
    <div className="dashboard">
      <h1>Advanced Data Dashboard</h1>
      
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <div className="dashboard-grid">
            <LazyChart userId={userId} />
            <LazyTable userId={userId} />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
