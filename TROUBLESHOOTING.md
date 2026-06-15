# Troubleshooting Guide

## Common Issues and Solutions

---

## Installation Issues

### Error: `npm install` fails

**Problem:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency
```

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Try installing with legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Update npm:
   ```bash
   npm install -g npm@latest
   ```

---

### Error: Node version incompatibility

**Problem:**
```
The engine "node" is incompatible with this package
```

**Solutions:**
1. Check your Node version:
   ```bash
   node --version
   ```

2. Install Node v14 or higher from nodejs.org

3. Use nvm (Node Version Manager) to switch versions:
   ```bash
   nvm use 16
   ```

---

## Server Issues

### Error: "Server running on http://localhost:5000" but can't connect

**Problem:**
- Cannot reach the server in browser
- Gets connection refused

**Solutions:**
1. Check if port 5000 is available:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. If port is in use, kill the process:
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # Mac/Linux
   kill -9 <PID>
   ```

3. Change port in `server.js`:
   ```javascript
   const PORT = process.env.PORT || 8000; // Changed to 8000
   ```

4. Check firewall settings (Windows/Mac)

---

### Error: "Cannot find module 'express'"

**Problem:**
```
Error: Cannot find module 'express'
```

**Solution:**
1. Run npm install:
   ```bash
   npm install
   ```

2. Verify node_modules folder exists:
   ```bash
   ls node_modules
   ```

3. If still failing, delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Error: Database permission denied

**Problem:**
```
Error opening database: Error: SQLITE_CANTOPEN
```

**Solutions:**
1. Check folder permissions:
   ```bash
   # Mac/Linux
   chmod 755 .
   ```

2. Delete old database and recreate:
   ```bash
   rm tasks.db
   npm start
   ```

3. Run as administrator (Windows):
   - Right-click command prompt → Run as administrator

---

## Authentication Issues

### Error: "No token provided" or "Invalid token"

**Problem:**
- Can't access dashboard after login
- Stuck on login page

**Solutions:**
1. Clear browser storage:
   - Press F12 → Application → Storage → Clear all

2. Check browser console for errors:
   - Press F12 → Console tab
   - Look for red error messages

3. Verify token is being stored:
   - F12 → Application → LocalStorage → http://localhost:5000
   - Check for "token" key

4. Check server logs for JWT errors:
   - Look in terminal where server is running

---

### Error: "Login failed" when credentials are correct

**Problem:**
- Email/password are correct but login fails
- Registration works fine

**Solutions:**
1. Check database:
   - Delete `tasks.db` file
   - Run `npm start` to recreate
   - Register again

2. Check bcrypt hashing:
   - Ensure `bcryptjs` is installed: `npm install bcryptjs`

3. Check server logs:
   - Look for error messages in terminal

4. Verify email is registered:
   - Try registering a new account
   - Then login with new credentials

---

### Error: "All fields are required"

**Problem:**
- Registration form shows this error even with all fields filled

**Solutions:**
1. Check for empty values:
   - Ensure password matches confirm password
   - No extra spaces

2. Check browser console:
   - F12 → Console for validation errors

3. Try different email:
   - Some emails might cause issues

---

## Frontend Issues

### Page loads but no tasks display

**Problem:**
- Dashboard loads but tasks container is empty
- No error messages

**Solutions:**
1. Check browser console (F12):
   - Look for network errors
   - Check for 401/403 authorization errors

2. Verify you're logged in:
   - Check if token exists in localStorage
   - F12 → Application → LocalStorage

3. Check server is running:
   - Is the terminal with server still open?
   - Look for "Server running" message

4. Check API URL in app.js:
   - Should be `http://localhost:5000`
   - Not `http://127.0.0.1:5000`

---

### Button clicks don't work

**Problem:**
- Buttons don't respond when clicked
- No errors in console

**Solutions:**
1. Hard refresh browser:
   ```
   Windows: Ctrl+Shift+R
   Mac: Cmd+Shift+R
   ```

2. Clear browser cache:
   - F12 → Network tab → Disable cache (checkbox)
   - Refresh page

3. Check JavaScript console:
   - F12 → Console for errors

4. Try different browser:
   - Chrome, Firefox, Safari, or Edge

---

### Modal dialog not appearing

**Problem:**
- "+ Add New Task" button does nothing
- Modal window doesn't show

**Solutions:**
1. Check app.js is loaded:
   - F12 → Network tab
   - Look for app.js in the list (should have 200 status)

2. Check for JavaScript errors:
   - F12 → Console tab
   - Any red errors?

3. Verify CSS is loaded:
   - F12 → Network tab
   - Look for style.css (should have 200 status)

4. Check browser compatibility:
   - Supported: Chrome, Firefox, Safari, Edge (latest versions)

---

## Database Issues

### Error: "SQLITE_READONLY"

**Problem:**
```
Error: SQLITE_READONLY: attempt to write a readonly database
```

**Solutions:**
1. Fix permissions:
   ```bash
   # Mac/Linux
   chmod 644 tasks.db
   chmod 755 .
   ```

2. Run as administrator (Windows)

3. Delete and recreate database:
   ```bash
   rm tasks.db
   npm start
   ```

---

### Database grows too large

**Problem:**
- tasks.db file is very large
- Database is slow

**Solutions:**
1. Backup data first:
   ```bash
   cp tasks.db tasks.db.backup
   ```

2. Clear old data:
   - Use database browser or SQL commands
   - Delete completed tasks older than 1 year

3. Optimize database:
   ```sql
   VACUUM;
   ```

---

### Tasks disappear after restart

**Problem:**
- Tasks are visible, but after server restart they're gone

**Solutions:**
1. Check database file exists:
   ```bash
   ls tasks.db
   ```

2. Verify server is using correct database path:
   - Check server.js: `DATABASE_PATH` variable

3. Check file permissions:
   - Database file should be readable/writable

4. Use database backup:
   ```bash
   cp tasks.db.backup tasks.db
   npm start
   ```

---

## Network Issues

### Error: "Connection error. Make sure server is running"

**Problem:**
- Getting this message in UI when trying to load tasks

**Solutions:**
1. Verify server is running:
   - Check terminal has "Server running" message
   - If not, run `npm start`

2. Check API URL:
   - Open F12 → Console
   - Check what URL is being used
   - Should be `http://localhost:5000`

3. Check CORS settings:
   - Server should have CORS enabled
   - Look for `app.use(cors())` in server.js

4. Check network tab:
   - F12 → Network tab
   - Try to load a task
   - Should see API calls to `http://localhost:5000/api/tasks`
   - Check response status (should be 200, not 401/403/500)

---

### CORS Error: "Access to XMLHttpRequest blocked"

**Problem:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/tasks' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Verify CORS is enabled in server.js:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

2. Ensure cors package is installed:
   ```bash
   npm install cors
   ```

3. Check frontend URL matches:
   - Frontend should be served from same origin as backend

---

## Performance Issues

### Application is slow

**Solutions:**
1. Check browser performance:
   - F12 → Performance tab
   - Record and analyze

2. Check database size:
   - Delete old/test data
   - Run `VACUUM` command

3. Check server resources:
   - Is terminal responsive?
   - Check CPU/Memory usage

4. Optimize queries:
   - Add database indexes
   - Limit query results

---

## Deployment Issues

### Error: "Port is already in use" on Heroku

**Problem:**
```
bind: Address already in use
```

**Solution:**
- Heroku assigns PORT via environment variable
- Use: `const PORT = process.env.PORT || 5000;`

---

### Database not persistent on Heroku

**Problem:**
- Data disappears after dyno restarts

**Solution:**
- SQLite doesn't persist on Heroku
- Switch to PostgreSQL:
  ```bash
  heroku addons:create heroku-postgresql:hobby-dev
  ```

---

## Getting Help

### Debug Checklist

Before asking for help, check:

- [ ] Node version is 14+
- [ ] npm install succeeded
- [ ] Server shows "Server running"
- [ ] Browser shows no console errors (F12)
- [ ] Port 5000 is available
- [ ] tasks.db file exists (after first run)
- [ ] Token is in localStorage
- [ ] API calls show 200 status (F12 Network)
- [ ] Tried clearing browser cache
- [ ] Tried restarting server

### Report Issues

When reporting issues, include:

1. Your error message (exact text)
2. What you were doing when it happened
3. Server logs output
4. Browser console errors (F12)
5. Your Node/npm versions
6. Your operating system
7. Steps to reproduce

### Useful Debug Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# View database contents
sqlite3 tasks.db "SELECT * FROM users;"

# Check disk space
df -h  # Mac/Linux
dir   # Windows

# View server logs
cat server.log
```

---

## Still Need Help?

1. **Check the main README.md** - Has overview
2. **Check API.md** - Has endpoint details
3. **Check QUICKSTART.md** - Has 5-minute setup
4. **Check server.js** - Read the comments
5. **Check app.js** - Read the code

---

Last updated: January 2024
