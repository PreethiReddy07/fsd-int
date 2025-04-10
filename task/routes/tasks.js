import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware for all routes
router.use(auth);

// Create Task
router.post('/', async (req, res) => {
    const task = new Task({ ...req.body, assignedTo: req.user.id });
    await task.save();
    res.status(201).json(task);
});

// Get All Tasks
router.get('/', async (req, res) => {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
});

// Get Single Task
router.get('/:id', async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// Update Task
router.put('/:id', async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, assignedTo: req.user.id },
        req.body,
        { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// Delete Task
router.delete('/:id', async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, assignedTo: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
});

export default router;
