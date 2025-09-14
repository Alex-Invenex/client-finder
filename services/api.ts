import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiResponse, Business, SearchQuery, SearchResult, WebsiteAnalysis, ContactInfo } from '@/types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async searchBusinesses(query: SearchQuery): Promise<ApiResponse<SearchResult>> {
    try {
      const response = await this.client.post('/api/search', query);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getBusinessDetails(businessId: string): Promise<ApiResponse<Business>> {
    try {
      const response = await this.client.get(`/api/business/${businessId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async analyzeWebsite(url: string): Promise<ApiResponse<WebsiteAnalysis>> {
    try {
      const response = await this.client.post('/api/analyze', { url });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getContactInfo(businessId: string): Promise<ApiResponse<ContactInfo>> {
    try {
      const response = await this.client.get(`/api/contact/${businessId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportResults(businessIds: string[], format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await this.client.post(
        '/api/export',
        { businessIds, format },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred',
        message: error.response?.data?.message || error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
      message: error.message || 'Unknown error',
    };
  }
}

export const apiService = new ApiService();