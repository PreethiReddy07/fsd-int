import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:2005/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.log('Error fetching tasks', err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    try {
      await axios.post('http://localhost:2005/api/tasks', { task: taskInput });
      setTaskInput('');
      fetchTasks();
    } catch (err) {
      console.log('Error adding task', err);
    }
  };

  const toggleComplete = async (id, complete) => {
    try {
      await axios.put(`http://localhost:2005/api/tasks/${id}`, { complete: !complete });
      fetchTasks();
    } catch (err) {
      console.log('Error updating task', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:2005/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log('Error deleting task', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="task-list">
      <h2>Your To-Do List</h2>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={taskInput}
          placeholder="Enter a task"
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-item">
            <span className={task.complete ? 'completed' : ''}>{task.task}</span>
            <div className="task-buttons">
              <button onClick={() => toggleComplete(task._id, task.complete)}>
                {task.complete ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      <button onClick={handleLogout} style={{ marginTop: '25px', backgroundColor: '#444' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
