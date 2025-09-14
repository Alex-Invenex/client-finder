import { z } from 'zod';

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  location: z.string().min(1, 'Location is required'),
  radius: z.number().min(1).max(100).optional(),
  category: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
});

export const businessSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  category: z.string(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  hours: z.array(z.string()).optional(),
  verified: z.boolean(),
  lastUpdated: z.date(),
});

export const websiteAnalysisSchema = z.object({
  url: z.string().url('Invalid URL'),
});

export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type BusinessInput = z.infer<typeof businessSchema>;
export type WebsiteAnalysisInput = z.infer<typeof websiteAnalysisSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;