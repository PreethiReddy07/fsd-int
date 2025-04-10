const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('tasks');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: user.username,
      tasks: user.tasks
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
