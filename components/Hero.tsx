'use client';

import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
            Find Your Next{' '}
            <span className="text-gradient">Perfect Client</span>
          </h1>

          <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
            Discover businesses, analyze their websites, and get verified contact information
            to grow your client base efficiently.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>10M+ Businesses</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Contacts</span>
            </div>
          </div>
        </div>

        <SearchBar placeholder="Try 'restaurants in New York' or 'tech companies in San Francisco'" />

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary-500">
            No credit card required • Free tier available • Cancel anytime
          </p>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}