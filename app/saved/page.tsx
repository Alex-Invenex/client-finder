'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BusinessCard from '@/components/BusinessCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Business } from '@/types';
import { Search, Filter, Download, Trash2, Mail, FileText, Calendar } from 'lucide-react';

// Mock data - replace with actual API calls
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  subscription: 'pro',
};

const mockSavedBusinesses = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    address: '123 Tech Street, San Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    email: 'contact@techcorp.com',
    rating: 4.5,
    reviewCount: 127,
    category: 'Technology',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    hours: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
    verified: true,
    lastUpdated: new Date('2024-01-15'),
    savedAt: new Date('2024-01-10'),
    notes: 'Potential client for web development services',
    tags: ['hot-lead', 'web-dev'],
    lastContacted: new Date('2024-01-08'),
  },
  {
    id: '2',
    name: 'Green Gardens Restaurant',
    address: '456 Food Ave, New York, NY 10001',
    phone: '+1 (555) 987-6543',
    website: 'https://greengardens.com',
    rating: 4.2,
    reviewCount: 89,
    category: 'Restaurant',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    hours: ['Mon-Sun: 11:00 AM - 10:00 PM'],
    verified: true,
    lastUpdated: new Date('2024-01-12'),
    savedAt: new Date('2024-01-05'),
    notes: 'Interested in POS system upgrade',
    tags: ['restaurant', 'pos-system'],
    lastContacted: null,
  },
  {
    id: '3',
    name: 'Wellness Center Plus',
    address: '789 Health Blvd, Los Angeles, CA 90210',
    phone: '+1 (555) 456-7890',
    website: 'https://wellnessplus.com',
    email: 'info@wellnessplus.com',
    rating: 4.8,
    reviewCount: 234,
    category: 'Healthcare',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    hours: ['Mon-Fri: 7:00 AM - 7:00 PM', 'Sat-Sun: 8:00 AM - 5:00 PM'],
    verified: true,
    lastUpdated: new Date('2024-01-14'),
    savedAt: new Date('2024-01-01'),
    notes: 'Looking for digital marketing services',
    tags: ['healthcare', 'marketing'],
    lastContacted: new Date('2024-01-03'),
  },
];

export default function SavedBusinessesPage() {
  const [savedBusinesses, setSavedBusinesses] = useState<any[]>(mockSavedBusinesses);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>(mockSavedBusinesses);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('savedAt');
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(savedBusinesses.map(b => b.category)));
  const allTags = Array.from(new Set(savedBusinesses.flatMap(b => b.tags || [])));

  useEffect(() => {
    let filtered = savedBusinesses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (business.notes && business.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(business => business.tags?.includes(selectedTag));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'savedAt':
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'lastContacted':
          if (!a.lastContacted && !b.lastContacted) return 0;
          if (!a.lastContacted) return 1;
          if (!b.lastContacted) return -1;
          return new Date(b.lastContacted).getTime() - new Date(a.lastContacted).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
  }, [savedBusinesses, searchQuery, selectedCategory, selectedTag, sortBy]);

  const handleRemoveBusiness = (businessId: string) => {
    setSavedBusinesses(prev => prev.filter(b => b.id !== businessId));
    setSelectedBusinesses(prev => {
      const newSet = new Set(prev);
      newSet.delete(businessId);
      return newSet;
    });
  };

  const handleSelectBusiness = (businessId: string, selected: boolean) => {
    setSelectedBusinesses(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(businessId);
      } else {
        newSet.delete(businessId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedBusinesses(new Set(filteredBusinesses.map(b => b.id)));
  };

  const handleDeselectAll = () => {
    setSelectedBusinesses(new Set());
  };

  const handleBulkRemove = () => {
    if (confirm(`Remove ${selectedBusinesses.size} selected businesses?`)) {
      setSavedBusinesses(prev => prev.filter(b => !selectedBusinesses.has(b.id)));
      setSelectedBusinesses(new Set());
    }
  };

  const handleExport = () => {
    const businessesToExport = filteredBusinesses.filter(b => selectedBusinesses.has(b.id));
    const csvContent = generateCSV(businessesToExport);
    downloadCSV(csvContent, 'saved-businesses.csv');
  };

  const generateCSV = (businesses: any[]) => {
    const headers = ['Name', 'Category', 'Phone', 'Website', 'Email', 'Rating', 'Address', 'Notes', 'Tags', 'Saved Date', 'Last Contacted'];
    const rows = businesses.map(b => [
      b.name,
      b.category,
      b.phone || '',
      b.website || '',
      b.email || '',
      b.rating || '',
      b.address,
      b.notes || '',
      (b.tags || []).join('; '),
      b.savedAt ? new Date(b.savedAt).toLocaleDateString() : '',
      b.lastContacted ? new Date(b.lastContacted).toLocaleDateString() : 'Never',
    ]);

    return [headers, ...rows].map(row =>
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Saved Businesses</h1>
          <p className="text-secondary-600">
            Manage your saved businesses and track your outreach efforts.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, address, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="savedAt">Recently Saved</option>
              <option value="name">Name (A-Z)</option>
              <option value="lastContacted">Last Contacted</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary-600">
                {filteredBusinesses.length} businesses found
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-primary-600 hover:text-primary-700"
                  disabled={selectedBusinesses.size === filteredBusinesses.length}
                >
                  Select All
                </button>
                <span className="text-secondary-300">|</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-primary-600 hover:text-primary-700"
                  disabled={selectedBusinesses.size === 0}
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedBusinesses.size > 0 && (
                <>
                  <span className="text-sm text-secondary-600">
                    {selectedBusinesses.size} selected
                  </span>

                  <button
                    onClick={handleExport}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                  <button
                    onClick={handleBulkRemove}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Remove selected"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Business List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-secondary-600">Loading saved businesses...</span>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-secondary-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No businesses found</h3>
              <p className="text-secondary-600 mb-4">
                {savedBusinesses.length === 0
                  ? "You haven't saved any businesses yet. Start searching to build your prospect list!"
                  : "No businesses match your current filters. Try adjusting your search criteria."
                }
              </p>
              {savedBusinesses.length === 0 && (
                <a href="/search" className="btn-primary">
                  Start Searching
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="flex items-start gap-4 bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                <input
                  type="checkbox"
                  checked={selectedBusinesses.has(business.id)}
                  onChange={(e) => handleSelectBusiness(business.id, e.target.checked)}
                  className="mt-6 w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />

                <div className="flex-1">
                  <BusinessCard
                    business={business}
                    onSave={() => handleRemoveBusiness(business.id)}
                    saved={true}
                  />
                </div>

                <div className="flex-shrink-0 space-y-4 ml-4">
                  {/* Metadata */}
                  <div className="text-right text-sm text-secondary-500">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <Calendar className="w-3 h-3" />
                      Saved {new Date(business.savedAt).toLocaleDateString()}
                    </div>

                    {business.lastContacted && (
                      <div className="flex items-center gap-1 justify-end">
                        <Mail className="w-3 h-3" />
                        Contacted {new Date(business.lastContacted).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {business.tags && business.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end">
                      {business.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {business.notes && (
                    <div className="max-w-xs">
                      <div className="flex items-center gap-1 text-xs text-secondary-500 mb-1">
                        <FileText className="w-3 h-3" />
                        Notes
                      </div>
                      <p className="text-sm text-secondary-700 bg-secondary-50 p-2 rounded text-right">
                        {business.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => handleRemoveBusiness(business.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}