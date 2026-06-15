# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
}
```

**Response (201):**
```json
{
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1
}
```

**Errors:**
- `400` - Missing fields or passwords don't match
- `400` - Username or email already exists
- `500` - Server error

---

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "securePassword123"
}
```

**Response (200):**
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 1,
    "username": "john_doe"
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

## Task Endpoints

### Get All Tasks
**GET** `/tasks`

Retrieve all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 1,
        "title": "Complete project",
        "description": "Finish the full-stack app",
        "status": "in-progress",
        "priority": "high",
        "due_date": "2024-12-31",
        "created_at": "2024-01-15 10:30:00",
        "updated_at": "2024-01-15 11:45:00"
    },
    {
        "id": 2,
        "user_id": 1,
        "title": "Review code",
        "description": "Review pull requests",
        "status": "pending",
        "priority": "medium",
        "due_date": "2024-01-20",
        "created_at": "2024-01-15 09:00:00",
        "updated_at": "2024-01-15 09:00:00"
    }
]
```

**Errors:**
- `401` - Unauthorized (invalid or missing token)
- `500` - Server error

---

### Get Single Task
**GET** `/tasks/:id`

Retrieve a specific task by ID.

**Parameters:**
- `id` (integer) - Task ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "id": 1,
    "user_id": 1,
    "title": "Complete project",
    "description": "Finish the full-stack app",
    "status": "in-progress",
    "priority": "high",
    "due_date": "2024-12-31",
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 11:45:00"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - Task not found
- `500` - Server error

---

### Create Task
**POST** `/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Buy groceries",
    "description": "Get milk, eggs, and bread",
    "priority": "low",
    "due_date": "2024-01-20"
}
```

**Response (201):**
```json
{
    "id": 3,
    "message": "Task created successfully"
}
```

**Field Requirements:**
- `title` (string, required) - Task title
- `description` (string, optional) - Task description
- `priority` (string, optional) - low | medium | high (default: medium)
- `due_date` (string, optional) - YYYY-MM-DD format

**Errors:**
- `400` - Missing required field (title)
- `401` - Unauthorized
- `500` - Server error

---

### Update Task
**PUT** `/tasks/:id`

Update an existing task.

**Parameters:**
- `id` (integer) - Task ID

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Buy groceries",
    "description": "Get milk, eggs, bread, and butter",
    "status": "completed",
    "priority": "high",
    "due_date": "2024-01-20"
}
```

**Response (200):**
```json
{
    "message": "Task updated successfully"
}
```

**Field Options:**
- `status` - pending | in-progress | completed
- `priority` - low | medium | high
- `due_date` - YYYY-MM-DD format or null

**Errors:**
- `401` - Unauthorized
- `404` - Task not found
- `500` - Server error

---

### Delete Task
**DELETE** `/tasks/:id`

Delete a task.

**Parameters:**
- `id` (integer) - Task ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "message": "Task deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - Task not found
- `500` - Server error

---

## User Endpoints

### Get User Profile
**GET** `/user/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
}
```

**Errors:**
- `401` - Unauthorized
- `500` - Server error

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication failed |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Error Responses

All errors return in this format:

```json
{
    "message": "Error description"
}
```

Example:
```json
{
    "message": "Task not found"
}
```

---

## Rate Limiting

Currently not implemented. For production, consider adding rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your-token>"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "description": "This is a test",
    "priority": "high",
    "due_date": "2024-12-31"
  }'
```

---

## Testing with Postman

1. Import this JSON into Postman for easy testing:

```json
{
    "info": {
        "name": "Task Manager API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Auth",
            "item": [
                {
                    "name": "Register",
                    "request": {
                        "method": "POST",
                        "url": "http://localhost:5000/api/auth/register"
                    }
                },
                {
                    "name": "Login",
                    "request": {
                        "method": "POST",
                        "url": "http://localhost:5000/api/auth/login"
                    }
                }
            ]
        }
    ]
}
```

---

## Webhook Support (Future)

Plan to add webhooks for:
- Task creation
- Task completion
- Task reminder

---

For implementation examples, check `server.js` and `frontend/app.js`
