module.exports = {
  apps: [
    {
      name: 'client-finder',
      script: 'npm',
      args: 'start',
      cwd: '/home/invenex/Client Finder',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  deploy: {
    production: {
      user: 'invenex',
      host: 'clientfinder.invenex.in',
      ref: 'origin/master',
      repo: 'git@github.com:your-username/client-finder.git',
      path: '/home/invenex/client-finder-deployment',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};