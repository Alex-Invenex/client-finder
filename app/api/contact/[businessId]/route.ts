import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const contactInfo = await prisma.contactInfo.findUnique({
      where: { businessId: params.businessId },
    });

    if (!contactInfo) {
      const business = await prisma.business.findUnique({
        where: { id: params.businessId },
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

      const basicContactInfo = {
        businessId: business.id,
        emails: business.email ? [business.email] : [],
        phones: business.phone ? [business.phone] : [],
        socialMedia: {},
        confidence: 0.5,
      };

      return NextResponse.json({
        success: true,
        data: basicContactInfo,
      });
    }

    return NextResponse.json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    console.error('Contact info API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to get contact information',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const body = await request.json();

    const contactInfo = await prisma.contactInfo.upsert({
      where: { businessId: params.businessId },
      update: {
        ...body,
        lastAnalyzed: new Date(),
        updatedAt: new Date(),
      },
      create: {
        businessId: params.businessId,
        ...body,
        lastAnalyzed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    console.error('Contact info creation API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to save contact information',
      },
      { status: 500 }
    );
  }
}