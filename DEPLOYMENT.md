# Client Finder Deployment Guide

## Quick Start

Deploy your Client Finder application to `clientfinder.invenex.in` using the provided scripts and configurations.

## Prerequisites

- Ubuntu/Debian server with sudo access
- Domain `clientfinder.invenex.in` pointing to your server
- PostgreSQL database (local or cloud)
- Google Places API key

## Deployment Options

### Option 1: Automated VPS Deployment (Recommended)

1. **Server Setup** (run once):
   ```bash
   sudo ./scripts/setup-server.sh
   ```

2. **Configure Environment**:
   ```bash
   cp .env.production .env
   # Edit .env with your actual values
   nano .env
   ```

3. **Deploy Application**:
   ```bash
   npm run deploy
   ```

### Option 2: Manual VPS Deployment

1. **Install PM2 and Nginx**:
   ```bash
   npm install -g pm2
   sudo apt install nginx
   ```

2. **Setup Database**:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

3. **Build and Start**:
   ```bash
   npm run build
   npm run pm2:start
   ```

4. **Configure Nginx**:
   ```bash
   sudo cp nginx/nginx.conf /etc/nginx/sites-available/clientfinder
   sudo ln -s /etc/nginx/sites-available/clientfinder /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl restart nginx
   ```

5. **Setup SSL**:
   ```bash
   sudo certbot --nginx -d clientfinder.invenex.in
   ```

### Option 3: Docker Deployment

1. **Build Docker Image**:
   ```bash
   npm run docker:build
   ```

2. **Run Container**:
   ```bash
   docker run -d \
     --name client-finder \
     -p 3000:3000 \
     --env-file .env.production \
     client-finder
   ```

### Option 4: Vercel Deployment (Easiest)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Add Domain**:
   - Go to Vercel dashboard
   - Add custom domain: `clientfinder.invenex.in`
   - Configure environment variables

## Environment Configuration

### Required Environment Variables

```env
# Core Configuration
NEXT_PUBLIC_APP_URL=https://clientfinder.invenex.in
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-here

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Google Places API
GOOGLE_PLACES_API_KEY=your-api-key-here
```

### Optional Environment Variables

```env
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# External APIs
CLEARBIT_API_KEY=your-clearbit-key
HUNTER_API_KEY=your-hunter-key
```

## Database Setup

### Local PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE client_finder_prod;
CREATE USER clientfinder WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE client_finder_prod TO clientfinder;
```

### Cloud Database Options

- **Supabase**: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
- **Neon**: `postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require`
- **PlanetScale**: Configure connection string from dashboard
- **Railway**: Automatic PostgreSQL provision

## SSL Setup

### Let's Encrypt (Free)

```bash
sudo certbot --nginx -d clientfinder.invenex.in
```

### Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Configure DNS records
3. Enable SSL/TLS encryption
4. Set SSL/TLS mode to "Full (strict)"

## PM2 Management

```bash
# Start application
npm run pm2:start

# View logs
npm run pm2:logs

# Monitor performance
npm run pm2:monitor

# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop
```

## GitHub Actions CI/CD

### Setup Repository Secrets

Go to GitHub repository → Settings → Secrets and add:

- `HOST`: Server IP address
- `USERNAME`: SSH username (invenex)
- `SSH_KEY`: Private SSH key for server access

### Manual Deployment Trigger

Go to Actions tab → Deploy to Production → Run workflow

## Monitoring and Maintenance

### Health Checks

```bash
# Local health check
npm run health-check

# Remote health check
curl https://clientfinder.invenex.in/api/health
```

### Backup

```bash
# Manual backup
npm run backup

# Automated backups are set up via cron
```

### Log Management

```bash
# View application logs
pm2 logs client-finder

# View Nginx logs
sudo tail -f /var/log/nginx/clientfinder.access.log
sudo tail -f /var/log/nginx/clientfinder.error.log
```

## Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Connection Issues**:
   ```bash
   # Test database connection
   npx prisma db pull
   ```

3. **PM2 Issues**:
   ```bash
   pm2 kill
   pm2 start ecosystem.config.js --env production
   ```

4. **Nginx Issues**:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Performance Optimization

1. **Enable Gzip** (already configured in Nginx)
2. **CDN Setup** with Cloudflare
3. **Database Indexing**:
   ```sql
   CREATE INDEX idx_businesses_category ON businesses(category);
   CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
   ```

## Security Checklist

- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ Rate limiting enabled
- ✅ Environment variables secured
- ✅ Database password encrypted
- ✅ Firewall configured
- ✅ Regular security updates

## Support

For deployment issues:
1. Check logs: `pm2 logs client-finder`
2. Verify health check: `curl https://clientfinder.invenex.in/api/health`
3. Review Nginx logs: `sudo tail -f /var/log/nginx/clientfinder.error.log`

## Quick Commands Reference

```bash
# Deployment
npm run deploy                 # Deploy to production
npm run deploy:staging         # Deploy to staging

# Database
npm run db:migrate            # Run migrations
npm run db:generate           # Generate Prisma client
npm run db:studio             # Open Prisma Studio

# PM2 Management
npm run pm2:start             # Start with PM2
npm run pm2:restart           # Restart application
npm run pm2:logs              # View logs
npm run pm2:monitor           # Monitor performance

# Docker
npm run docker:build          # Build Docker image
npm run docker:run            # Run Docker container

# Maintenance
npm run backup                # Create backup
npm run health-check          # Check application health
```