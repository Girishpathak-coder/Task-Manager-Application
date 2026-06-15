# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```
This installs all required packages (Express, SQLite, JWT, etc.)

### Step 2: Start the Server
```bash
npm start
```
You'll see: "Server running on http://localhost:5000"

### Step 3: Open in Browser
Navigate to: http://localhost:5000

### Step 4: Create Account
- Click "Sign up here"
- Enter username, email, password
- You're ready to go! 🎉

---

## Test Account (After First Run)

If you want to quickly test without creating an account, the first user you create becomes your test account.

---

## Key URLs

| Page | URL |
|------|-----|
| Login | http://localhost:5000/frontend/login.html |
| Register | http://localhost:5000/frontend/register.html |
| Dashboard | http://localhost:5000/frontend/index.html |

---

## Common Tasks

### View Tasks
- Go to Dashboard after login
- Tasks are organized by status in sidebar

### Add a Task
- Click "+ Add New Task"
- Fill title (required) and optional fields
- Save!

### Change Task Status
- Click "Mark Complete" or "Mark Incomplete"
- Or use dropdown in edit modal

### Filter Tasks
- Click status buttons in sidebar
- View Pending, In Progress, or Completed

### Delete Account (Data Reset)
- Clear browser storage: DevTools → Application → Storage → Clear all
- Delete `tasks.db` file
- Restart server

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | ESC |
| Submit Form | CTRL+ENTER |

---

## Need Help?

1. **Server won't start?**
   - Check if port 5000 is available
   - Run: `npm install` again

2. **Tasks not showing?**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Verify you're logged in

3. **Database issues?**
   - Delete `tasks.db` file
   - Restart server (it will recreate the database)

---

## Next Steps

- Read full [README.md](README.md) for detailed documentation
- Explore code in `server.js` and `frontend/app.js`
- Customize colors in `frontend/style.css`
- Deploy to cloud (Heroku, Vercel, AWS, etc.)

Happy tasking! 📝✨
