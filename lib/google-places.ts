import axios from 'axios';
import { Business } from '@/types';

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    weekday_text: string[];
  };
}

interface GooglePlacesSearchResponse {
  results: GooglePlaceDetails[];
  next_page_token?: string;
  status: string;
}

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google Places API key is required');
    }
  }

  async searchBusinesses(
    query: string,
    location: string,
    radius: number = 10000
  ): Promise<Business[]> {
    try {
      const response = await axios.get<GooglePlacesSearchResponse>(
        `${this.baseUrl}/textsearch/json`,
        {
          params: {
            query: `${query} in ${location}`,
            key: this.apiKey,
            radius,
            type: 'establishment',
          },
        }
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return response.data.results.map(this.transformToBusinessData);
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }

  async getBusinessDetails(placeId: string): Promise<Business | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/details/json`,
        {
          params: {
            place_id: placeId,
            key: this.apiKey,
            fields: 'place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry,opening_hours',
          },
        }
      );

      if (response.data.status !== 'OK') {
        return null;
      }

      return this.transformToBusinessData(response.data.result);
    } catch (error) {
      console.error('Error getting business details:', error);
      return null;
    }
  }

  private transformToBusinessData(place: GooglePlaceDetails): Business {
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      category: this.mapTypesToCategory(place.types),
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      hours: place.opening_hours?.weekday_text || [],
      verified: true,
      lastUpdated: new Date(),
    };
  }

  private mapTypesToCategory(types: string[]): string {
    const categoryMap: Record<string, string> = {
      restaurant: 'Restaurant',
      food: 'Restaurant',
      store: 'Retail',
      retail: 'Retail',
      hospital: 'Healthcare',
      doctor: 'Healthcare',
      health: 'Healthcare',
      lawyer: 'Legal Services',
      accounting: 'Professional Services',
      bank: 'Financial Services',
      school: 'Education',
      gym: 'Fitness & Wellness',
      beauty_salon: 'Beauty & Spa',
      car_dealer: 'Automotive',
      real_estate_agency: 'Real Estate',
      contractor: 'Construction',
      entertainment: 'Entertainment',
    };

    for (const type of types) {
      if (categoryMap[type]) {
        return categoryMap[type];
      }
    }

    return 'Other';
  }
}