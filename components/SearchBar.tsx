'use client';

import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { BUSINESS_CATEGORIES, SEARCH_RADIUS_OPTIONS } from '@/lib/constants';

interface SearchBarProps {
  onSearch?: (query: string, location: string, filters: any) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search for businesses..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [radius, setRadius] = useState(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query && location) {
      onSearch(query, location, { category, radius });
    } else if (query && location) {
      // Redirect to search page
      const params = new URLSearchParams({
        q: query,
        location: location,
      });
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or ZIP"
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors duration-200 flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden md:inline">Filters</span>
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={!query || !location}
          >
            Search
          </button>
        </div>

        {showFilters && (
          <div className="bg-secondary-50 p-4 rounded-lg space-y-3 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Search Radius
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {SEARCH_RADIUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}