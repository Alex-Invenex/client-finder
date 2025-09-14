import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const exportSchema = z.object({
  businessIds: z.array(z.string()),
  format: z.enum(['csv', 'json']).default('csv'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = exportSchema.parse(body);
    const { businessIds, format } = validatedData;

    const businesses = await prisma.business.findMany({
      where: {
        id: {
          in: businessIds,
        },
      },
      include: {
        contactInfo: true,
        websiteAnalysis: true,
      },
    });

    if (businesses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'No businesses found',
        },
        { status: 404 }
      );
    }

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: businesses,
      });
    }

    const csv = generateCSV(businesses);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="businesses.csv"',
      },
    });
  } catch (error) {
    console.error('Export API error:', error);

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
        message: 'Failed to export data',
      },
      { status: 500 }
    );
  }
}

function generateCSV(businesses: any[]): string {
  const headers = [
    'Name',
    'Address',
    'Phone',
    'Website',
    'Email',
    'Rating',
    'Review Count',
    'Category',
    'Verified',
    'Contact Emails',
    'Contact Phones',
    'Social Media',
    'Last Updated',
  ];

  const rows = businesses.map(business => [
    escapeCSV(business.name),
    escapeCSV(business.address),
    escapeCSV(business.phone || ''),
    escapeCSV(business.website || ''),
    escapeCSV(business.email || ''),
    business.rating || '',
    business.reviewCount || '',
    escapeCSV(business.category),
    business.verified ? 'Yes' : 'No',
    escapeCSV(business.contactInfo?.emails?.join('; ') || ''),
    escapeCSV(business.contactInfo?.phones?.join('; ') || ''),
    escapeCSV(formatSocialMedia(business.contactInfo?.socialMedia || {})),
    business.lastUpdated.toISOString(),
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatSocialMedia(socialMedia: any): string {
  if (!socialMedia || typeof socialMedia !== 'object') return '';

  return Object.entries(socialMedia)
    .map(([platform, url]) => `${platform}: ${url}`)
    .join('; ');
}