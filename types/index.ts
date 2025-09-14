export interface Business {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  rating?: number;
  reviewCount?: number;
  category: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  hours?: string[];
  verified: boolean;
  lastUpdated: Date;
}

export interface SearchQuery {
  query: string;
  location: string;
  radius?: number;
  category?: string;
  minRating?: number;
}

export interface SearchResult {
  businesses: Business[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  emails: string[];
  phones: string[];
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  technologies: string[];
  lastAnalyzed: Date;
}

export interface ContactInfo {
  businessId: string;
  emails: string[];
  phones: string[];
  socialMedia: Record<string, string>;
  website?: string;
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'enterprise';
  creditsUsed: number;
  creditsLimit: number;
  createdAt: Date;
  updatedAt: Date;
}