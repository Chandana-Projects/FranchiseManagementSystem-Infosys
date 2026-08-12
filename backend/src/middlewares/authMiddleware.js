const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../services/authService");

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

exports.requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required." });
        }

        const userRole = (req.user.role || "manager").toLowerCase();
        const rolesLower = allowedRoles.map(role => role.toLowerCase());

        if (!rolesLower.includes(userRole) && !rolesLower.includes("admin")) {
            return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
        }

        next();
    };
};

exports.optionalAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // Ignore expired/invalid token in optional auth mode
        }
    }

    next();
};
