#!/bin/bash

# Server Setup Script for Client Finder
# This script sets up a fresh Ubuntu/Debian server for deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run as root (use sudo)"
fi

log "Starting server setup for Client Finder..."

# Update system
log "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
log "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install essential packages
log "Installing essential packages..."
apt install -y \
    build-essential \
    git \
    nginx \
    postgresql \
    postgresql-contrib \
    certbot \
    python3-certbot-nginx \
    ufw \
    curl \
    wget \
    htop

# Install PM2 globally
log "Installing PM2..."
npm install -g pm2

# Setup PostgreSQL
log "Setting up PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE DATABASE client_finder_prod;
CREATE USER clientfinder WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE client_finder_prod TO clientfinder;
EOF

# Setup firewall
log "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# Create application directory
log "Creating application directory..."
mkdir -p /home/invenex/Client\ Finder
chown -R invenex:invenex /home/invenex/Client\ Finder

# Create log directory
log "Creating log directory..."
mkdir -p /var/log/nginx
mkdir -p /home/invenex/Client\ Finder/logs
chown -R invenex:invenex /home/invenex/Client\ Finder/logs

# Setup Nginx
log "Setting up Nginx..."
if [ -f "/home/invenex/Client Finder/nginx/nginx.conf" ]; then
    cp /home/invenex/Client\ Finder/nginx/nginx.conf /etc/nginx/sites-available/clientfinder
    ln -sf /etc/nginx/sites-available/clientfinder /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
else
    warning "Nginx configuration not found. Please configure manually."
fi

# Setup SSL with Let's Encrypt
log "Setting up SSL certificate..."
certbot --nginx -d clientfinder.invenex.in --non-interactive --agree-tos --email admin@invenex.in || warning "SSL setup failed"

# Setup PM2 startup script
log "Setting up PM2 startup script..."
pm2 startup systemd -u invenex --hp /home/invenex
systemctl enable pm2-invenex

# Create systemd service for auto-start
log "Creating systemd service..."
cat > /etc/systemd/system/client-finder.service <<EOF
[Unit]
Description=Client Finder Next.js Application
After=network.target

[Service]
Type=simple
User=invenex
WorkingDirectory=/home/invenex/Client Finder
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/client-finder.log
StandardError=append:/var/log/client-finder-error.log

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable client-finder

# Setup log rotation
log "Setting up log rotation..."
cat > /etc/logrotate.d/client-finder <<EOF
/home/invenex/Client\ Finder/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 invenex invenex
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Install monitoring tools
log "Installing monitoring tools..."
npm install -g clinic
npm install -g autocannon

# Create backup directory
log "Creating backup directory..."
mkdir -p /home/invenex/backups
chown invenex:invenex /home/invenex/backups

# Setup cron for automatic backups
log "Setting up automatic backups..."
(crontab -u invenex -l 2>/dev/null; echo "0 2 * * * /home/invenex/Client\ Finder/scripts/backup.sh") | crontab -u invenex -

log "Server setup completed successfully!"
log "Next steps:"
echo "1. Clone your repository to /home/invenex/Client Finder"
echo "2. Copy and configure .env.production file"
echo "3. Run npm install"
echo "4. Run database migrations: npx prisma migrate deploy"
echo "5. Build the application: npm run build"
echo "6. Start with PM2: pm2 start ecosystem.config.js --env production"