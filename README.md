# Client Finder

A powerful Next.js application for finding and connecting with potential business clients. Search millions of businesses, analyze their websites, and get verified contact information to grow your client base efficiently.

## Features

- **Smart Business Search**: Search millions of businesses by location, category, ratings, and more
- **Website Analysis**: Automatically analyze business websites to extract contact information
- **Verified Contact Info**: Get verified email addresses, phone numbers, and social media contacts
- **Data Export**: Export search results to CSV or integrate with your CRM via API
- **Real-time Data**: Access up-to-date business information from multiple sources
- **GDPR Compliant**: All data collected from public sources with privacy compliance

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Places API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Alex-Invenex/client-finder.git
cd client-finder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- `GOOGLE_PLACES_API_KEY`: Your Google Places API key
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: Application URL (default: http://localhost:3000)

4. Set up the database:
```bash
npx prisma init
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
client-finder/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Hero.tsx          # Hero section
│   ├── SearchBar.tsx     # Search functionality
│   └── FeatureCard.tsx   # Feature display cards
├── lib/                   # Utilities and helpers
│   ├── constants.ts      # App constants
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript definitions
│   └── index.ts          # Type interfaces
├── services/              # Business logic
│   ├── api.ts            # API service layer
│   └── validation.ts     # Zod schemas
└── public/                # Static assets
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Run migrations
```

## API Routes

### Search Businesses
```
POST /api/search
Body: {
  query: string,
  location: string,
  radius?: number,
  category?: string,
  minRating?: number
}
```

### Get Business Details
```
GET /api/business/:id
```

### Analyze Website
```
POST /api/analyze
Body: {
  url: string
}
```

### Get Contact Info
```
GET /api/contact/:businessId
```

### Export Data
```
POST /api/export
Body: {
  businessIds: string[],
  format: 'csv' | 'json'
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_PLACES_API_KEY` | Google Places API key for business data | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_APP_URL` | Public application URL | Yes |
| `NEXTAUTH_URL` | NextAuth authentication URL | No |
| `NEXTAUTH_SECRET` | NextAuth secret key | No |
| `SMTP_*` | Email service configuration | No |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | API rate limiting | No |

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker
```bash
docker build -t client-finder .
docker run -p 3000:3000 --env-file .env client-finder
```

### Traditional Hosting
```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@clientfinder.com or open an issue in the GitHub repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database ORM by [Prisma](https://www.prisma.io/)