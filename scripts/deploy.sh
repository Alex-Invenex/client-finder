#!/bin/bash

# Client Finder Deployment Script
# Usage: ./scripts/deploy.sh [production|staging]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENV=${1:-production}
APP_NAME="client-finder"
APP_DIR="/home/invenex/Client Finder"
BACKUP_DIR="/home/invenex/backups"
LOG_FILE="/var/log/client-finder-deploy.log"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Check if running as correct user
if [ "$USER" != "invenex" ]; then
    error "This script must be run as the invenex user"
fi

log "Starting deployment for $ENV environment..."

# Navigate to app directory
cd "$APP_DIR" || error "Failed to navigate to app directory"

# Create backup
log "Creating backup..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/client-finder-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" --exclude=node_modules --exclude=.next --exclude=logs .
log "Backup created at $BACKUP_FILE"

# Pull latest code
log "Pulling latest code from repository..."
git pull origin master || warning "Git pull failed or no git repository"

# Install dependencies
log "Installing dependencies..."
npm ci --production=false

# Run database migrations
log "Running database migrations..."
npx prisma migrate deploy || warning "Database migration failed"

# Generate Prisma client
log "Generating Prisma client..."
npx prisma generate

# Build the application
log "Building Next.js application..."
npm run build || error "Build failed"

# Copy environment file
if [ "$ENV" = "production" ]; then
    if [ -f ".env.production" ]; then
        log "Using production environment file..."
        cp .env.production .env
    else
        error "Production environment file not found"
    fi
fi

# Restart application with PM2
log "Restarting application with PM2..."
if pm2 list | grep -q "$APP_NAME"; then
    pm2 reload "$APP_NAME" --update-env
    log "Application reloaded"
else
    pm2 start ecosystem.config.js --env "$ENV"
    log "Application started"
fi

# Save PM2 configuration
pm2 save

# Clear Next.js cache
log "Clearing Next.js cache..."
rm -rf .next/cache

# Test the deployment
log "Testing deployment..."
sleep 5
curl -f http://localhost:3000/api/health || warning "Health check failed"

# Reload Nginx
log "Reloading Nginx configuration..."
sudo nginx -t && sudo systemctl reload nginx || warning "Nginx reload failed"

log "Deployment completed successfully!"

# Show application status
pm2 status "$APP_NAME"

# Cleanup old backups (keep last 5)
log "Cleaning up old backups..."
ls -t "$BACKUP_DIR"/client-finder-*.tar.gz | tail -n +6 | xargs -r rm

log "Deployment script finished."