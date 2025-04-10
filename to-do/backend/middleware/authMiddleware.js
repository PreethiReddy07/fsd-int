const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    //console.log(decoded.userId+"10");
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
