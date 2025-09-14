import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { GooglePlacesService } from '@/lib/google-places';
import { searchQuerySchema } from '@/services/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = searchQuerySchema.parse(body);
    const { query, location, radius = 10, category, minRating } = validatedData;

    const googlePlaces = new GooglePlacesService();
    let businesses = await googlePlaces.searchBusinesses(
      query,
      location,
      radius * 1000 // Convert miles to meters
    );

    if (category) {
      businesses = businesses.filter(b => b.category === category);
    }

    if (minRating) {
      businesses = businesses.filter(b => (b.rating || 0) >= minRating);
    }

    const searchRecord = await prisma.search.create({
      data: {
        query,
        location,
        radius,
        category,
        minRating,
      },
    });

    const businessRecords = await Promise.all(
      businesses.map(async (business) => {
        const existingBusiness = await prisma.business.findUnique({
          where: { placeId: business.id },
        });

        if (existingBusiness) {
          await prisma.business.update({
            where: { id: existingBusiness.id },
            data: {
              name: business.name,
              address: business.address,
              phone: business.phone,
              website: business.website,
              rating: business.rating,
              reviewCount: business.reviewCount,
              category: business.category,
              latitude: business.coordinates?.lat,
              longitude: business.coordinates?.lng,
              hours: business.hours,
              lastUpdated: new Date(),
            },
          });

          await prisma.searchResult.create({
            data: {
              searchId: searchRecord.id,
              businessId: existingBusiness.id,
            },
          });

          return { ...existingBusiness, ...business };
        } else {
          const newBusiness = await prisma.business.create({
            data: {
              name: business.name,
              address: business.address,
              phone: business.phone,
              website: business.website,
              email: business.email,
              rating: business.rating,
              reviewCount: business.reviewCount,
              category: business.category,
              latitude: business.coordinates?.lat,
              longitude: business.coordinates?.lng,
              hours: business.hours,
              verified: business.verified,
              placeId: business.id,
            },
          });

          await prisma.searchResult.create({
            data: {
              searchId: searchRecord.id,
              businessId: newBusiness.id,
            },
          });

          return {
            ...newBusiness,
            coordinates: business.coordinates,
          };
        }
      })
    );

    const totalCount = businessRecords.length;
    const pageSize = 20;
    const page = 1;

    return NextResponse.json({
      success: true,
      data: {
        businesses: businessRecords.slice(0, pageSize),
        totalCount,
        page,
        pageSize,
        hasMore: totalCount > pageSize,
        searchId: searchRecord.id,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to search businesses',
      },
      { status: 500 }
    );
  }
}