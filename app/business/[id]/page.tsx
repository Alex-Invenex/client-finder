'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Star,
  Clock,
  Users,
  Share2,
  Bookmark,
  ExternalLink,
  Calendar,
  Shield
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { Business, ContactInfo, WebsiteAnalysis } from '@/types';
import { apiService } from '@/services/api';
import { formatPhoneNumber, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function BusinessDetailPage() {
  const params = useParams();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [analyzingWebsite, setAnalyzingWebsite] = useState(false);

  useEffect(() => {
    loadBusinessDetails();
  }, [businessId]);

  const loadBusinessDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const [businessResponse, contactResponse] = await Promise.all([
        apiService.getBusinessDetails(businessId),
        apiService.getContactInfo(businessId),
      ]);

      if (businessResponse.success && businessResponse.data) {
        setBusiness(businessResponse.data);
      } else {
        setError(businessResponse.error || 'Business not found');
        return;
      }

      if (contactResponse.success && contactResponse.data) {
        setContactInfo(contactResponse.data);
      }
    } catch (err) {
      setError('Failed to load business details');
      console.error('Error loading business:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWebsite = async () => {
    if (!business?.website) return;

    try {
      setAnalyzingWebsite(true);
      const response = await apiService.analyzeWebsite(business.website);

      if (response.success && response.data) {
        setWebsiteAnalysis(response.data);
      }
    } catch (error) {
      console.error('Website analysis failed:', error);
    } finally {
      setAnalyzingWebsite(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = async () => {
    if (navigator.share && business) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name} on Client Finder`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-secondary-600">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Business Not Found</h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <Link href="/search" className="btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <div className="bg-white border-b border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-secondary-600 hover:text-secondary-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                  {business.name}
                  {business.verified && (
                    <Shield className="w-5 h-5 text-accent-600" title="Verified Business" />
                  )}
                </h1>
                <p className="text-secondary-600">{business.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  saved
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Business Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-secondary-900">{business.address}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 text-sm hover:text-primary-700 inline-flex items-center gap-1 mt-1"
                    >
                      View on Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <a
                      href={`tel:${business.phone}`}
                      className="text-secondary-900 hover:text-primary-600 transition-colors"
                    >
                      {formatPhoneNumber(business.phone)}
                    </a>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-900 hover:text-primary-600 transition-colors"
                      >
                        {business.website.replace(/^https?:\/\//, '')}
                      </a>
                      <button
                        onClick={handleAnalyzeWebsite}
                        disabled={analyzingWebsite}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors disabled:opacity-50"
                      >
                        {analyzingWebsite ? 'Analyzing...' : 'Analyze'}
                      </button>
                    </div>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <a
                      href={`mailto:${business.email}`}
                      className="text-secondary-900 hover:text-primary-600 transition-colors"
                    >
                      {business.email}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                  <span className="text-secondary-900">
                    Last updated: {formatDate(business.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hours */}
            {business.hours && business.hours.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </h2>
                <div className="space-y-2">
                  {business.hours.map((hour, index) => (
                    <div key={index} className="text-secondary-900">
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Website Analysis */}
            {websiteAnalysis && (
              <div className="card">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Website Analysis</h2>

                <div className="space-y-4">
                  {websiteAnalysis.title && (
                    <div>
                      <h3 className="font-medium text-secondary-900 mb-1">Page Title</h3>
                      <p className="text-secondary-700">{websiteAnalysis.title}</p>
                    </div>
                  )}

                  {websiteAnalysis.description && (
                    <div>
                      <h3 className="font-medium text-secondary-900 mb-1">Description</h3>
                      <p className="text-secondary-700">{websiteAnalysis.description}</p>
                    </div>
                  )}

                  {websiteAnalysis.technologies && websiteAnalysis.technologies.length > 0 && (
                    <div>
                      <h3 className="font-medium text-secondary-900 mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {websiteAnalysis.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {websiteAnalysis.emails && websiteAnalysis.emails.length > 0 && (
                    <div>
                      <h3 className="font-medium text-secondary-900 mb-2">Found Emails</h3>
                      <div className="space-y-1">
                        {websiteAnalysis.emails.map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="block text-primary-600 hover:text-primary-700"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {websiteAnalysis.phones && websiteAnalysis.phones.length > 0 && (
                    <div>
                      <h3 className="font-medium text-secondary-900 mb-2">Found Phone Numbers</h3>
                      <div className="space-y-1">
                        {websiteAnalysis.phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone}`}
                            className="block text-primary-600 hover:text-primary-700"
                          >
                            {formatPhoneNumber(phone)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating & Reviews */}
            {business.rating && (
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-secondary-900">
                      {business.rating.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(business.rating!)
                              ? 'text-yellow-400 fill-current'
                              : 'text-secondary-300'
                          }`}
                        />
                      ))}
                    </div>
                    {business.reviewCount && (
                      <p className="text-sm text-secondary-600 mt-1">
                        {business.reviewCount} reviews
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {contactInfo && (
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h3>

                <div className="space-y-3">
                  {contactInfo.emails && contactInfo.emails.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-2">Email Addresses</h4>
                      <div className="space-y-1">
                        {contactInfo.emails.map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="block text-primary-600 hover:text-primary-700 text-sm"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {contactInfo.phones && contactInfo.phones.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-2">Phone Numbers</h4>
                      <div className="space-y-1">
                        {contactInfo.phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone}`}
                            className="block text-primary-600 hover:text-primary-700 text-sm"
                          >
                            {formatPhoneNumber(phone)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-secondary-200">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <Shield className="w-4 h-4" />
                      <span>Confidence: {Math.round(contactInfo.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn-primary text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                <button className="w-full btn-secondary text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Add to Campaign
                </button>
                <button className="w-full btn-secondary text-sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}