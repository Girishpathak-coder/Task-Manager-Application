const API_URL = 'http://localhost:5000';
let currentEditingTaskId = null;
let currentFilter = 'all';
let allTasks = [];

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    initializeEventListeners();
    loadUserProfile();
    loadTasks();
});

function initializeEventListeners() {
    // Filter buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('.nav-btn').classList.add('active');
            currentFilter = e.target.closest('.nav-btn').dataset.filter;
            filterAndDisplayTasks();
        });
    });

    // Modal controls
    const modal = document.getElementById('taskModal');
    const openBtn = document.getElementById('openAddTaskBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const taskForm = document.getElementById('taskForm');

    openBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', () => closeModal());
    cancelBtn.addEventListener('click', () => closeModal());
    taskForm.addEventListener('submit', handleTaskSubmit);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ==================== Task Management ====================
async function loadTasks() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = 'login.html';
            }
            throw new Error('Failed to load tasks');
        }

        allTasks = await response.json();
        filterAndDisplayTasks();
    } catch (err) {
        console.error('Error loading tasks:', err);
        showNotification('Error loading tasks', 'error');
    }
}

function filterAndDisplayTasks() {
    let filteredTasks = allTasks;

    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }

    displayTasks(filteredTasks);
}

function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="no-tasks">
                <h3>No tasks yet</h3>
                <p>Click "Add New Task" to create your first task</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-card ${task.priority} ${task.status}">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button class="task-btn" onclick="editTask(${task.id})" title="Edit">✏️</button>
                    <button class="task-btn" onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
                </div>
            </div>

            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}

            <div class="task-meta">
                <span class="task-badge priority-${task.priority}">
                    ${capitalizeFirst(task.priority)} Priority
                </span>
                <span class="task-badge status-${task.status}">
                    ${capitalizeFirst(task.status)}
                </span>
            </div>

            ${task.due_date ? `<div class="task-due-date">📅 Due: ${formatDate(task.due_date)}</div>` : ''}

            <div class="task-footer">
                ${task.status !== 'completed' ? `
                    <button class="task-action-btn edit-btn" onclick="markAsComplete(${task.id})">Mark Complete</button>
                ` : `
                    <button class="task-action-btn edit-btn" onclick="markAsIncomplete(${task.id})">Mark Incomplete</button>
                `}
                <button class="task-action-btn edit-btn" onclick="editTask(${task.id})">Edit</button>
            </div>
        </div>
    `).join('');
}

async function handleTaskSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const status = document.getElementById('taskStatus').value;

    try {
        const token = localStorage.getItem('token');
        const method = currentEditingTaskId ? 'PUT' : 'POST';
        const url = currentEditingTaskId 
            ? `${API_URL}/api/tasks/${currentEditingTaskId}`
            : `${API_URL}/api/tasks`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, priority, due_date: dueDate, status })
        });

        if (!response.ok) throw new Error('Failed to save task');

        await response.json();
        closeModal();
        await loadTasks();
        showNotification(currentEditingTaskId ? 'Task updated successfully' : 'Task created successfully', 'success');
    } catch (err) {
        console.error('Error saving task:', err);
        showNotification('Error saving task', 'error');
    }
}

function openModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');

    form.reset();
    currentEditingTaskId = taskId;

    if (taskId) {
        const task = allTasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('modalTitle').textContent = 'Edit Task';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.due_date || '';
            document.getElementById('taskStatus').value = task.status;
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Task';
    }

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('show');
    currentEditingTaskId = null;
}

async function editTask(taskId) {
    openModal(taskId);
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete task');

        await loadTasks();
        showNotification('Task deleted successfully', 'success');
    } catch (err) {
        console.error('Error deleting task:', err);
        showNotification('Error deleting task', 'error');
    }
}

async function markAsComplete(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        await updateTaskStatus(taskId, 'completed');
    }
}

async function markAsIncomplete(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        await updateTaskStatus(taskId, 'pending');
    }
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        const token = localStorage.getItem('token');
        const task = allTasks.find(t => t.id === taskId);

        const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                priority: task.priority,
                due_date: task.due_date,
                status: newStatus
            })
        });

        if (!response.ok) throw new Error('Failed to update task');

        await loadTasks();
        showNotification('Task updated successfully', 'success');
    } catch (err) {
        console.error('Error updating task:', err);
        showNotification('Error updating task', 'error');
    }
}

// ==================== User Management ====================
async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        const response = await fetch(`${API_URL}/api/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load profile');

        const user = await response.json();
        document.getElementById('userInfo').textContent = `Logged in as: ${user.username}`;
    } catch (err) {
        console.error('Error loading profile:', err);
    }
}

// ==================== Utility Functions ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'info') {
    // Simple notification - you can enhance this with a toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Optional: Show in UI with alert for now
    if (type === 'error') {
        console.error(message);
    }
}
