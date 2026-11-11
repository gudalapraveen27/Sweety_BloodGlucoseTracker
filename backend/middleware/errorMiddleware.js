function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'A reading already exists for this time slot and date.' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(error.status || 500).json({
    message: error.status ? error.message : 'Something went wrong. Please try again.'
  });
}

module.exports = { notFound, errorHandler };
