const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error with detailed information
  logger.error('Request Error', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    message: err.message,
    statusCode: err.statusCode,
    body: req.body,
    query: req.query,
    userId: req.user?.id
  });

  // Don't expose stack trace in production
  const response = {
    success: false,
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(err.statusCode).json(response);
};

module.exports = errorMiddleware;
