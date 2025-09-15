#!/bin/bash

# Backup Script for Client Finder
# Creates backups of database and application files

set -e

# Configuration
BACKUP_DIR="/home/invenex/backups"
APP_DIR="/home/invenex/Client Finder"
DB_NAME="client_finder_prod"
DB_USER="clientfinder"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RETENTION_DAYS=7

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "Starting backup process..."

# Backup database
log "Backing up database..."
DB_BACKUP_FILE="$BACKUP_DIR/db-$DB_NAME-$TIMESTAMP.sql.gz"
PGPASSWORD=$DB_PASSWORD pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > "$DB_BACKUP_FILE"
log "Database backup created: $DB_BACKUP_FILE"

# Backup application files
log "Backing up application files..."
APP_BACKUP_FILE="$BACKUP_DIR/app-client-finder-$TIMESTAMP.tar.gz"
tar -czf "$APP_BACKUP_FILE" \
    --exclude="$APP_DIR/node_modules" \
    --exclude="$APP_DIR/.next" \
    --exclude="$APP_DIR/logs" \
    --exclude="$APP_DIR/.git" \
    -C "$(dirname "$APP_DIR")" \
    "$(basename "$APP_DIR")"
log "Application backup created: $APP_BACKUP_FILE"

# Backup environment files
log "Backing up environment files..."
ENV_BACKUP_FILE="$BACKUP_DIR/env-$TIMESTAMP.tar.gz"
cd "$APP_DIR"
tar -czf "$ENV_BACKUP_FILE" .env* ecosystem.config.js 2>/dev/null || true
log "Environment backup created: $ENV_BACKUP_FILE"

# Upload to cloud storage (optional - requires configuration)
# Uncomment and configure if using AWS S3
# log "Uploading to S3..."
# aws s3 cp "$DB_BACKUP_FILE" s3://your-backup-bucket/database/
# aws s3 cp "$APP_BACKUP_FILE" s3://your-backup-bucket/application/
# aws s3 cp "$ENV_BACKUP_FILE" s3://your-backup-bucket/environment/

# Clean up old backups
log "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete

# Check backup sizes
log "Backup summary:"
ls -lh "$BACKUP_DIR"/*-$TIMESTAMP* | awk '{print $9 ": " $5}'

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "Total backup directory size: $TOTAL_SIZE"

log "Backup completed successfully!"