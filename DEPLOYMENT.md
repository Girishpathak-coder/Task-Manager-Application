# Deployment Guide

## Deploying Your Task Manager

This guide covers deploying your full-stack Task Manager to popular cloud platforms.

---

## Option 1: Heroku (Recommended for Beginners)

### Prerequisites
- Heroku account (heroku.com)
- Heroku CLI installed
- Git installed

### Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Create a Procfile in project root:**
   ```bash
   echo "web: node server.js" > Procfile
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your-super-secret-key-here-change-this
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Open your app:**
   ```bash
   heroku open
   ```

Your app will be live at: `https://your-app-name.herokuapp.com`

---

## Option 2: Vercel (For Frontend Only)

If deploying frontend separately:

1. **Build frontend bundle:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

---

## Option 3: AWS (EC2)

### Prerequisites
- AWS account
- EC2 instance running Ubuntu

### Steps

1. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **Clone your repository:**
   ```bash
   git clone your-repo-url
   cd Task-Manager
   npm install
   ```

4. **Install PM2 (process manager):**
   ```bash
   sudo npm install -g pm2
   ```

5. **Start with PM2:**
   ```bash
   pm2 start server.js --name "task-manager"
   pm2 startup
   pm2 save
   ```

6. **Configure nginx as reverse proxy:**
   ```bash
   sudo yum install -y nginx
   sudo systemctl start nginx
   ```

7. **Configure Security Groups to allow port 80 and 443**

---

## Option 4: DigitalOcean

### Prerequisites
- DigitalOcean account
- Droplet running Ubuntu

### Steps

1. **SSH into droplet:**
   ```bash
   ssh root@your-droplet-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup:**
   ```bash
   git clone your-repo-url
   cd Task-Manager
   npm install
   ```

4. **Install and configure PM2:**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "task-manager"
   pm2 startup
   pm2 save
   ```

5. **Install Nginx:**
   ```bash
   sudo apt-get install -y nginx
   ```

6. **Create Nginx config** (`/etc/nginx/sites-available/default`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Install SSL (Let's Encrypt):**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Option 5: Railway.app (New & Simple)

1. **Connect GitHub:**
   - Sign up at railway.app
   - Connect your GitHub account

2. **Deploy:**
   - Click "New Project"
   - Select your repository
   - Select "Node.js"
   - Set environment variables

3. **Done!** Railway auto-deploys on push

---

## Pre-Deployment Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs from production code
- [ ] Update database path if not using SQLite
- [ ] Test locally with `npm start`
- [ ] Ensure package.json has correct main entry
- [ ] Add Procfile or start script
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS/SSL
- [ ] Configure auto-backups for database

---

## Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-random-string
JWT_EXPIRES_IN=24h
DATABASE_PATH=./tasks.db
FRONTEND_URL=https://your-domain.com
```

---

## Database Migration (Production)

For production, consider using PostgreSQL instead of SQLite:

1. **Update server.js:**
   ```javascript
   // Replace sqlite3 with pg (PostgreSQL client)
   const { Pool } = require('pg');
   ```

2. **Install PostgreSQL client:**
   ```bash
   npm install pg
   ```

3. **Update connection string:**
   ```javascript
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL
   });
   ```

---

## Monitoring & Logs

### Heroku
```bash
heroku logs --tail
```

### AWS/DO (with PM2)
```bash
pm2 logs
pm2 monit
```

---

## Performance Tips

1. Enable gzip compression in Express
2. Use CDN for static files
3. Implement caching headers
4. Optimize database queries
5. Use Redis for session storage
6. Implement rate limiting

---

## Security Tips

1. Always use HTTPS
2. Set secure headers (Helmet.js)
3. Validate all inputs
4. Use environment variables for secrets
5. Keep dependencies updated
6. Regular security audits
7. Implement rate limiting
8. Use strong password hashing

---

## Troubleshooting Deployment

**App crashes on start:**
- Check `npm start` works locally
- Verify all dependencies are in package.json
- Check environment variables

**Database errors:**
- Ensure database permissions
- Check database path
- Migrate data if switching databases

**Port conflicts:**
- Set PORT environment variable
- Check firewall rules

**Memory issues:**
- Increase droplet/instance size
- Optimize database queries
- Implement caching

---

For more help, check the documentation of your chosen platform!
