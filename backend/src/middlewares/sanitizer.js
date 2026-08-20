/**
 * Deep Input Sanitizer & Prototype Pollution Defense Middleware
 * Recursively cleans request bodies, query params, and route parameters.
 */

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function sanitizeValue(val) {
  if (typeof val === "string") {
    // Strip null bytes and dangerous script tags
    return val
      .replace(/\0/g, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === "object") {
    const cleanObj = {};
    for (const key of Object.keys(val)) {
      if (!DANGEROUS_KEYS.has(key.toLowerCase())) {
        cleanObj[key] = sanitizeValue(val[key]);
      }
    }
    return cleanObj;
  }
  return val;
}

function inputSanitizer(req, res, next) {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === "object") {
      req.query = sanitizeValue(req.query);
    }
    if (req.params && typeof req.params === "object") {
      req.params = sanitizeValue(req.params);
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = inputSanitizer;
