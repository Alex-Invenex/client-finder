'use client';

import { Business } from '@/types';
import { MapPin, Phone, Globe, Star, Clock, Mail } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/utils';
import Link from 'next/link';

interface BusinessCardProps {
  business: Business;
  onSave?: (businessId: string) => void;
  saved?: boolean;
}

export default function BusinessCard({ business, onSave, saved = false }: BusinessCardProps) {
  const handleSave = () => {
    if (onSave) {
      onSave(business.id);
    }
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link
            href={`/business/${business.id}`}
            className="text-xl font-semibold text-secondary-900 hover:text-primary-600 transition-colors"
          >
            {business.name}
          </Link>

          {business.verified && (
            <span className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
              Verified
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          className={`p-2 rounded-lg transition-colors ${
            saved
              ? 'bg-primary-100 text-primary-600'
              : 'bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600'
          }`}
          title={saved ? 'Saved' : 'Save business'}
        >
          <Star className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2 text-secondary-600">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <span className="text-sm">{business.address}</span>
        </div>

        {business.phone && (
          <div className="flex items-center gap-2 text-secondary-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <a
              href={`tel:${business.phone}`}
              className="text-sm hover:text-primary-600 transition-colors"
            >
              {formatPhoneNumber(business.phone)}
            </a>
          </div>
        )}

        {business.website && (
          <div className="flex items-center gap-2 text-secondary-600">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-primary-600 transition-colors truncate"
            >
              {business.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}

        {business.email && (
          <div className="flex items-center gap-2 text-secondary-600">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <a
              href={`mailto:${business.email}`}
              className="text-sm hover:text-primary-600 transition-colors"
            >
              {business.email}
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
        <div className="flex items-center gap-4">
          {business.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-secondary-700">
                {business.rating.toFixed(1)}
              </span>
              {business.reviewCount && (
                <span className="text-xs text-secondary-500">
                  ({business.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
            {business.category}
          </span>
        </div>

        {business.hours && business.hours.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-secondary-500">
            <Clock className="w-3 h-3" />
            <span>Hours available</span>
          </div>
        )}
      </div>
    </div>
  );
}