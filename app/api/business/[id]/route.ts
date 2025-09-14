import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        contactInfo: true,
        websiteAnalysis: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Business not found',
        },
        { status: 404 }
      );
    }

    const businessData = {
      ...business,
      coordinates: business.latitude && business.longitude
        ? { lat: business.latitude, lng: business.longitude }
        : undefined,
    };

    return NextResponse.json({
      success: true,
      data: businessData,
    });
  } catch (error) {
    console.error('Business details API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to get business details',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const business = await prisma.business.update({
      where: { id: params.id },
      data: {
        ...body,
        latitude: body.coordinates?.lat,
        longitude: body.coordinates?.lng,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error('Business update API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update business',
      },
      { status: 500 }
    );
  }
}