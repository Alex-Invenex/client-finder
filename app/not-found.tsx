import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Page Not Found</h1>
          <p className="text-secondary-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 justify-center">
            <Link href="/" className="btn-primary flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>

            <Link href="/search" className="btn-secondary flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Businesses
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </div>

        <div className="mt-12 text-sm text-secondary-500">
          <p>Need help? <Link href="/help" className="text-primary-600 hover:text-primary-700">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
}