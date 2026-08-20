const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err.name === 'ZodError' || err instanceof ZodError) {
    const issues = err.issues || err.errors || [];
    const formatErrors = issues.map((e) => ({
      field: e.path ? e.path.join('.') : 'unknown',
      message: e.message,
    }));
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formatErrors,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  let rawMessage = err.message || 'Internal Server Error';

  // Security check: Scrub database connection strings, passwords, or internal file paths
  let sanitizedMessage = rawMessage
    .replace(/postgresql:\/\/[^@]+@/gi, 'postgresql://***:***@')
    .replace(/mongodb(\+srv)?:\/\/[^@]+@/gi, 'mongodb://***:***@')
    .replace(/mysql:\/\/[^@]+@/gi, 'mysql://***:***@')
    .replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED]');

  // In production, mask unhandled internal server errors
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    sanitizedMessage = 'An unexpected server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    status: 'error',
    message: sanitizedMessage,
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { requestId: req.id } : {}),
  });
};

module.exports = errorHandler;
