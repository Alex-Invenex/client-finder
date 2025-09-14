'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          Oops! Something went wrong
        </h2>

        <p className="text-secondary-600 mb-6">
          We encountered an unexpected error while loading this page. This could be a temporary issue.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-secondary-500 hover:text-secondary-700">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-secondary-100 rounded text-xs font-mono text-secondary-800 overflow-auto max-h-32">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.digest && (
                <div>
                  <strong>Error ID:</strong> {error.digest}
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>

        <div className="mt-6 text-sm text-secondary-500">
          <p>
            If this problem continues, please{' '}
            <a href="mailto:support@clientfinder.com" className="text-primary-600 hover:text-primary-700">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}