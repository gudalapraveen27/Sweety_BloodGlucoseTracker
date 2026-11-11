const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }

  try {
    const token = authorization.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please log in again.' });
  }
}

module.exports = protect;
