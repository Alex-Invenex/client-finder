import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <h2 className="text-lg font-medium text-secondary-900 mb-2">Loading...</h2>
        <p className="text-secondary-600">Please wait while we load your content.</p>
      </div>
    </div>
  );
}