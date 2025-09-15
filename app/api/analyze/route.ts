import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';
import { websiteAnalysisSchema } from '@/services/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = websiteAnalysisSchema.parse(body);
    const { url } = validatedData;

    const business = await prisma.business.findFirst({
      where: { website: url },
    });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not found',
          message: 'Business not found for this website',
        },
        { status: 404 }
      );
    }

    const analysis = await analyzeWebsite(url);

    const websiteAnalysis = await prisma.websiteAnalysis.upsert({
      where: { businessId: business.id },
      update: {
        ...analysis,
        lastAnalyzed: new Date(),
        updatedAt: new Date(),
      },
      create: {
        businessId: business.id,
        ...analysis,
        lastAnalyzed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: websiteAnalysis,
    });
  } catch (error) {
    console.error('Website analysis API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.issues[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to analyze website',
      },
      { status: 500 }
    );
  }
}

async function analyzeWebsite(url: string) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClientFinder/1.0)',
      },
    });

    const $ = cheerio.load(response.data);

    const title = $('title').first().text().trim();
    const description = $('meta[name="description"]').attr('content') || '';

    const emails = extractEmails(response.data);
    const phones = extractPhones(response.data);
    const socialMedia = extractSocialMedia($);
    const technologies = extractTechnologies(response.data, $);

    return {
      url,
      title,
      description,
      emails,
      phones,
      socialMedia,
      technologies,
    };
  } catch (error) {
    console.error('Error analyzing website:', error);
    throw new Error('Failed to analyze website');
  }
}

function extractEmails(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = html.match(emailRegex) || [];
  return Array.from(new Set(emails)).filter(email =>
    !email.includes('example.com') &&
    !email.includes('placeholder')
  );
}

function extractPhones(html: string): string[] {
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const phones = html.match(phoneRegex) || [];
  return Array.from(new Set(phones));
}

function extractSocialMedia($: cheerio.CheerioAPI): Record<string, string> {
  const socialMedia: Record<string, string> = {};

  const platforms = {
    facebook: ['facebook.com', 'fb.com'],
    twitter: ['twitter.com', 'x.com'],
    linkedin: ['linkedin.com'],
    instagram: ['instagram.com'],
    youtube: ['youtube.com'],
  };

  $('a[href*="facebook.com"], a[href*="fb.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) socialMedia.facebook = href;
  });

  $('a[href*="twitter.com"], a[href*="x.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) socialMedia.twitter = href;
  });

  $('a[href*="linkedin.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) socialMedia.linkedin = href;
  });

  $('a[href*="instagram.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) socialMedia.instagram = href;
  });

  return socialMedia;
}

function extractTechnologies(html: string, $: cheerio.CheerioAPI): string[] {
  const technologies: string[] = [];

  if (html.includes('wp-content') || html.includes('wordpress')) {
    technologies.push('WordPress');
  }

  if (html.includes('shopify') || $('script[src*="shopify"]').length > 0) {
    technologies.push('Shopify');
  }

  if ($('script[src*="react"]').length > 0 || html.includes('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
    technologies.push('React');
  }

  if ($('script[src*="vue"]').length > 0 || html.includes('Vue.js')) {
    technologies.push('Vue.js');
  }

  if ($('script[src*="angular"]').length > 0) {
    technologies.push('Angular');
  }

  if ($('script[src*="jquery"]').length > 0 || html.includes('jQuery')) {
    technologies.push('jQuery');
  }

  if ($('script[src*="bootstrap"]').length > 0 || $('link[href*="bootstrap"]').length > 0) {
    technologies.push('Bootstrap');
  }

  return Array.from(new Set(technologies));
}