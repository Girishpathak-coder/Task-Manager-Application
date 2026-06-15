const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Database setup
const db = new sqlite3.Database('tasks.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create tasks table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'medium',
            due_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    });
}

// Authentication Middleware
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Username or email already exists' });
                }
                return res.status(500).json({ message: 'Error registering user' });
            }

            const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '24h' });
            res.status(201).json({ message: 'User registered successfully', token, userId: this.lastID });
        }
    );
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Login successful', token, userId: user.id, username: user.username });
    });
});

// ==================== TASK ROUTES ====================

// Get all tasks for user
app.get('/api/tasks', verifyToken, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.userId], (err, tasks) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching tasks' });
        }
        res.json(tasks);
    });
});

// Get single task
app.get('/api/tasks/:id', verifyToken, (req, res) => {
    db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId], (err, task) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching task' });
        }
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    });
});

// Create task
app.post('/api/tasks', verifyToken, (req, res) => {
    const { title, description, priority, due_date } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    db.run(
        'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
        [req.userId, title, description || '', priority || 'medium', due_date || null],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error creating task' });
            }
            res.status(201).json({ id: this.lastID, message: 'Task created successfully' });
        }
    );
});

// Update task
app.put('/api/tasks/:id', verifyToken, (req, res) => {
    const { title, description, status, priority, due_date } = req.body;

    db.run(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [title, description, status, priority, due_date, req.params.id, req.userId],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error updating task' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
});

// Delete task
app.delete('/api/tasks/:id', verifyToken, (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.userId], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting task' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// Get user profile
app.get('/api/user/profile', verifyToken, (req, res) => {
    db.get('SELECT id, username, email FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching profile' });
        }
        res.json(user);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
