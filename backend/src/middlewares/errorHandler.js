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

  // Handle general errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

module.exports = errorHandler;

