'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import BusinessCard from '@/components/BusinessCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { Business, SearchResult } from '@/types';
import { apiService } from '@/services/api';
import { Filter, Download, Map } from 'lucide-react';

export default function SearchPage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBusinesses, setSavedBusinesses] = useState<Set<string>>(new Set());
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set());

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';

  useEffect(() => {
    if (initialQuery && initialLocation) {
      handleSearch(initialQuery, initialLocation, {});
    }
  }, [initialQuery, initialLocation]);

  const handleSearch = async (query: string, location: string, filters: any) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        location: location,
      });
      router.push(`/search?${params.toString()}`);

      const response = await apiService.searchBusinesses({
        query,
        location,
        ...filters,
      });

      if (response.success && response.data) {
        setSearchResult(response.data);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError('An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusiness = (businessId: string) => {
    setSavedBusinesses(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(businessId)) {
        newSaved.delete(businessId);
      } else {
        newSaved.add(businessId);
      }
      return newSaved;
    });
  };

  const handleSelectBusiness = (businessId: string, selected: boolean) => {
    setSelectedBusinesses(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(businessId);
      } else {
        newSelected.delete(businessId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (searchResult?.businesses) {
      const allIds = searchResult.businesses.map(b => b.id);
      setSelectedBusinesses(new Set(allIds));
    }
  };

  const handleDeselectAll = () => {
    setSelectedBusinesses(new Set());
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (selectedBusinesses.size === 0) {
      alert('Please select businesses to export');
      return;
    }

    try {
      const blob = await apiService.exportResults(Array.from(selectedBusinesses), format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `businesses.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Refine your search..."
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-secondary-600">Searching businesses...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {searchResult && !loading && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-secondary-900 mb-1">
                  Search Results
                </h1>
                <p className="text-secondary-600">
                  Found {searchResult.totalCount} businesses
                  {initialQuery && ` for "${initialQuery}"`}
                  {initialLocation && ` in ${initialLocation}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAll}
                  className="btn-secondary text-sm"
                  disabled={selectedBusinesses.size === searchResult.businesses.length}
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="btn-secondary text-sm"
                  disabled={selectedBusinesses.size === 0}
                >
                  Deselect All
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="btn-primary text-sm flex items-center gap-2"
                  disabled={selectedBusinesses.size === 0}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {searchResult.businesses.map((business) => (
                <div key={business.id} className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedBusinesses.has(business.id)}
                    onChange={(e) => handleSelectBusiness(business.id, e.target.checked)}
                    className="mt-6 w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <BusinessCard
                      business={business}
                      onSave={handleSaveBusiness}
                      saved={savedBusinesses.has(business.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {searchResult.hasMore && (
              <div className="text-center mt-8">
                <button className="btn-secondary">
                  Load More Results
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && !searchResult && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-secondary-900">No search performed</h3>
              <p className="mt-1 text-sm text-secondary-500">
                Enter your search criteria above to find businesses.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}