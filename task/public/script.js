let token = '';
let editingTaskId = null;

function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
        .then(res => res.json())
        .then(data => alert(data.message || 'Registered'))
        .catch(err => alert('Error'));
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                token = data.token;
                document.getElementById('task-section').style.display = 'block';
                loadTasks();
            } else {
                alert('Login failed');
            }
        });
}

function createTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const status = document.getElementById('status').value;

    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, description, dueDate, status })
    })
        .then(res => res.json())
        .then(() => loadTasks());
}

function loadTasks() {
    fetch('/api/tasks', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(res => res.json())
        .then(tasks => {
            const container = document.getElementById('tasks');
            container.innerHTML = '';

            tasks.forEach(task => {
                const div = document.createElement('div');
                div.className = 'task';
                div.innerHTML = `
        <strong>${task.title}</strong> (${task.status})<br/>
        ${task.description || ''}<br/>
        Due: ${task.dueDate ? task.dueDate.split('T')[0] : 'N/A'}<br/>
        <button onclick="editTask('${task._id}', '${task.title}', '${task.description || ''}', '${task.status}', '${task.dueDate ? task.dueDate.split('T')[0] : ''}')">Edit</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      `;
                container.appendChild(div);
            });
        });
}

function deleteTask(id) {
    fetch('/api/tasks/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(() => loadTasks());
}

function editTask(id, title, description, status, dueDate) {
    editingTaskId = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-dueDate').value = dueDate;
    document.getElementById('edit-status').value = status;
    document.getElementById('edit-section').style.display = 'block';
}

function submitEdit() {
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const dueDate = document.getElementById('edit-dueDate').value;
    const status = document.getElementById('edit-status').value;

    fetch(`/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, description, dueDate, status })
    })
        .then(res => res.json())
        .then(() => {
            editingTaskId = null;
            document.getElementById('edit-section').style.display = 'none';
            loadTasks();
        });
}

function cancelEdit() {
    editingTaskId = null;
    document.getElementById('edit-section').style.display = 'none';
}
