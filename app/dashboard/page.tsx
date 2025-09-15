'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Search,
  Users,
  TrendingUp,
  Download,
  Calendar,
  Star,
  MapPin,
  BarChart3,
  PlusCircle,
  Filter,
  Eye
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  subscription: 'pro',
  creditsUsed: 75,
  creditsLimit: 100,
};

const mockStats = {
  totalSearches: 156,
  businessesFound: 1248,
  savedBusinesses: 89,
  emailsCollected: 267,
};

const mockRecentSearches = [
  {
    id: '1',
    query: 'restaurants',
    location: 'New York, NY',
    results: 45,
    date: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    query: 'tech companies',
    location: 'San Francisco, CA',
    results: 78,
    date: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    query: 'fitness studios',
    location: 'Los Angeles, CA',
    results: 32,
    date: '2024-01-13T09:20:00Z',
  },
];

const mockSavedBusinesses = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    category: 'Technology',
    location: 'San Francisco, CA',
    rating: 4.5,
    lastContacted: '2024-01-10',
  },
  {
    id: '2',
    name: 'Gourmet Bistro',
    category: 'Restaurant',
    location: 'New York, NY',
    rating: 4.2,
    lastContacted: '2024-01-08',
  },
  {
    id: '3',
    name: 'Wellness Center Plus',
    category: 'Healthcare',
    location: 'Los Angeles, CA',
    rating: 4.8,
    lastContacted: '2024-01-05',
  },
];

const searchTrendsData = [
  { month: 'Oct', searches: 45 },
  { month: 'Nov', searches: 67 },
  { month: 'Dec', searches: 89 },
  { month: 'Jan', searches: 156 },
];

const categoryData = [
  { name: 'Restaurant', value: 30, color: '#3B82F6' },
  { name: 'Technology', value: 25, color: '#10B981' },
  { name: 'Healthcare', value: 20, color: '#F59E0B' },
  { name: 'Retail', value: 15, color: '#EF4444' },
  { name: 'Other', value: 10, color: '#8B5CF6' },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar user={mockUser} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
              <p className="text-secondary-600 mt-1">
                Welcome back, {mockUser.name}! Here&apos;s your business intelligence overview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>

              <button className="btn-primary flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                New Search
              </button>
            </div>
          </div>
        </div>

        {/* Credits Usage */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Credits Usage</h3>
              <p className="text-primary-100">
                {mockUser.creditsUsed} of {mockUser.creditsLimit} credits used this month
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {mockUser.creditsLimit - mockUser.creditsUsed}
              </div>
              <p className="text-primary-100 text-sm">Credits remaining</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-primary-500 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(mockUser.creditsUsed / mockUser.creditsLimit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Searches</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {mockStats.totalSearches}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-secondary-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Businesses Found</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {mockStats.businessesFound.toLocaleString()}
                </p>
              </div>
              <div className="bg-accent-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-secondary-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Saved Businesses</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {mockStats.savedBusinesses}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+23%</span>
              <span className="text-secondary-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Emails Collected</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {mockStats.emailsCollected}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-secondary-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Search Trends */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Search Trends</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">View Details</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={searchTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="searches" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Search Categories</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-secondary-700">
                    {category.name} ({category.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Searches */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Searches</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="space-y-4">
              {mockRecentSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Search className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{search.query}</p>
                      <div className="flex items-center gap-1 text-sm text-secondary-600">
                        <MapPin className="w-3 h-3" />
                        {search.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">{search.results} results</p>
                    <p className="text-xs text-secondary-500">
                      {new Date(search.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Businesses */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Saved Businesses</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">View All</button>
            </div>
            <div className="space-y-4">
              {mockSavedBusinesses.map((business) => (
                <div key={business.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent-100 p-2 rounded-lg">
                      <Star className="w-4 h-4 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{business.name}</p>
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <span>{business.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {business.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-secondary-400 hover:text-secondary-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-secondary-500">
                      Last contacted: {business.lastContacted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}