<<<<<<< HEAD
# Task Manager - Full Stack Application

A modern, full-stack task management application built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

✅ **User Authentication**
- User registration and login
- Secure password hashing with bcryptjs
- JWT-based authentication

✅ **Task Management**
- Create, read, update, and delete tasks
- Set task priority (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- Add due dates to tasks
- Filter tasks by status

✅ **Modern UI**
- Responsive design (works on desktop and mobile)
- Beautiful gradient interface
- Real-time task updates
- Interactive task cards
- Modal form for task creation/editing

## Project Structure

```
Task-Manager/
├── server.js              # Express backend server
├── package.json           # Dependencies
├── tasks.db              # SQLite database (auto-created)
├── dashboard.html        # Legacy dashboard (optional)
├── frontend/
│   ├── index.html        # Main dashboard
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   ├── app.js            # Frontend JavaScript
│   ├── style.css         # Styling
│   └── images/           # Image assets folder
└── README.md             # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd Task-Manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

```bash
npm start
```

or for development mode:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Access the Frontend

Open your browser and navigate to:
```
http://localhost:5000
```

You'll be redirected to the login page if you're not authenticated.

## Usage

### Creating an Account

1. Click "Sign up here" on the login page
2. Enter a username, email, and password
3. Click "Sign Up"
4. You'll be automatically logged in and redirected to the dashboard

### Logging In

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to the task dashboard

### Managing Tasks

**Create a Task:**
- Click "+ Add New Task" button
- Fill in the task details (title is required)
- Select priority and due date (optional)
- Click "Save Task"

**View Tasks:**
- All tasks are displayed as cards on the dashboard
- Use the sidebar filters to view tasks by status:
  - All Tasks
  - Pending
  - In Progress
  - Completed

**Edit a Task:**
- Click the ✏️ edit icon on any task card
- Modify the details in the modal
- Click "Save Task"

**Complete a Task:**
- Click "Mark Complete" on a pending/in-progress task
- The task status will change to completed

**Delete a Task:**
- Click the 🗑️ delete icon on any task card
- Confirm the deletion

**Logout:**
- Click "🚪 Logout" in the sidebar footer

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for logged-in user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### User
- `GET /api/user/profile` - Get user profile

## Database Schema

### Users Table
```sql
- id: INTEGER PRIMARY KEY
- username: TEXT UNIQUE NOT NULL
- email: TEXT UNIQUE NOT NULL
- password: TEXT NOT NULL (hashed)
- created_at: DATETIME
```

### Tasks Table
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER (foreign key)
- title: TEXT NOT NULL
- description: TEXT
- status: TEXT (pending, in-progress, completed)
- priority: TEXT (low, medium, high)
- due_date: TEXT
- created_at: DATETIME
- updated_at: DATETIME
```

## Security Features

- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens are used for session management
- Token expiration set to 24 hours
- Protected API routes require valid authentication token
- SQL injection prevention using parameterized queries

## Configuration

The server runs on **port 5000** by default. To change this:

1. Open `server.js`
2. Find the line: `const PORT = 5000;`
3. Change it to your desired port
4. Also update `API_URL` in `app.js` if needed

**Important Security Note:** Change the JWT secret key for production:
- Open `server.js`
- Find: `const JWT_SECRET = 'your-secret-key-change-this-in-production';`
- Replace with a secure random string

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**Issue: "Connection error. Make sure server is running."**
- Ensure the server is running with `npm start`
- Check if port 5000 is not blocked by firewall
- Verify API_URL in `app.js` matches your server address

**Issue: Tasks not loading**
- Check browser console for errors (F12 -> Console)
- Verify you're logged in (check localStorage in DevTools)
- Ensure the backend server is running

**Issue: Cannot login/register**
- Check if database file `tasks.db` exists in the project root
- Try clearing browser cache and localStorage
- Restart the server

## Future Enhancements

- [ ] Email notifications for task reminders
- [ ] Task categories/tags
- [ ] Task sharing and collaboration
- [ ] Advanced filtering and search
- [ ] Dark mode
- [ ] Mobile app version
- [ ] Export tasks to PDF/CSV
- [ ] Recurring tasks
- [ ] Task comments and attachments

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please check:
1. Browser console for error messages (F12)
2. Server console for backend errors
3. Network tab to see API calls

---

**Enjoy managing your tasks!** 📋✨
=======
# Task-Manager-Application
Task Manager is a full-stack web application that helps users organize and manage their daily tasks efficiently. Built with React.js, Backend, and MongoDB, it provides features such as user authentication, task creation, editing, deletion, and status tracking through a responsive and user-friendly interface.
>>>>>>> aa143f6dbb6203c86ed86113e10218998cf69a26
