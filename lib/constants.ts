export const APP_NAME = 'Client Finder';
export const APP_DESCRIPTION = 'Find and connect with potential clients for your business';

export const BUSINESS_CATEGORIES = [
  'Restaurant',
  'Retail',
  'Healthcare',
  'Professional Services',
  'Technology',
  'Education',
  'Fitness & Wellness',
  'Beauty & Spa',
  'Automotive',
  'Real Estate',
  'Construction',
  'Entertainment',
  'Financial Services',
  'Legal Services',
  'Manufacturing',
  'Other',
] as const;

export const SEARCH_RADIUS_OPTIONS = [
  { label: '1 mile', value: 1 },
  { label: '5 miles', value: 5 },
  { label: '10 miles', value: 10 },
  { label: '25 miles', value: 25 },
  { label: '50 miles', value: 50 },
] as const;

export const RATING_OPTIONS = [
  { label: 'Any Rating', value: 0 },
  { label: '3+ Stars', value: 3 },
  { label: '4+ Stars', value: 4 },
  { label: '4.5+ Stars', value: 4.5 },
] as const;

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 10,
    features: [
      '10 searches per month',
      'Basic business information',
      'Limited contact info',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    credits: 100,
    features: [
      '100 searches per month',
      'Full business information',
      'Complete contact details',
      'Website analysis',
      'Export to CSV',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    credits: -1, // Unlimited
    features: [
      'Unlimited searches',
      'API access',
      'Bulk operations',
      'Custom integrations',
      'Dedicated account manager',
      'Priority support',
    ],
  },
} as const;

export const API_ENDPOINTS = {
  SEARCH: '/api/search',
  BUSINESS: '/api/business',
  ANALYZE: '/api/analyze',
  CONTACT: '/api/contact',
  USER: '/api/user',
  AUTH: '/api/auth',
} as const;