const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      // Pass the zod error to the global error handler
      next(error);
    }
  };
};

module.exports = validateRequest;
