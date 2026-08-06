const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

// Local fallback store for offline development
const memoryUsers = new Map();

// Initialize default requested user abhi@gmail.com / abhi
(async () => {
  const hash = await bcrypt.hash("abhi", 10);
  memoryUsers.set("abhi@gmail.com", {
    user_id: 1,
    full_name: "Abhishek Pattnaik",
    email: "abhi@gmail.com",
    password_hash: hash,
    role: "admin",
    outlet_id: 1,
  });
})();

async function register({ full_name, email, password, role, outlet_id }) {
  const password_hash = await bcrypt.hash(password, 10);

  try {
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
      const err = new Error("An account with this email already exists");
      err.status = 409;
      throw err;
    }

    const user = await prisma.users.create({
      data: {
        full_name,
        email,
        password_hash,
        role: role || "manager",
        outlet_id: outlet_id || null,
      },
    });

    return sanitizeUser(user);
  } catch (dbErr) {
    if (dbErr.status === 409) throw dbErr;
    
    // In-memory fallback
    if (memoryUsers.has(email)) {
      const err = new Error("An account with this email already exists");
      err.status = 409;
      throw err;
    }

    const newUser = {
      user_id: memoryUsers.size + 1,
      full_name,
      email,
      password_hash,
      role: role || "manager",
      outlet_id: outlet_id || null,
    };
    memoryUsers.set(email, newUser);
    return sanitizeUser(newUser);
  }
}

async function login({ email, password }) {
  let user = null;

  try {
    user = await prisma.users.findUnique({ where: { email } });
  } catch (dbErr) {
    // Database connection fallback to memory store
    user = memoryUsers.get(email) || null;
  }

  if (!user && memoryUsers.has(email)) {
    user = memoryUsers.get(email);
  }

  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role, outlet_id: user.outlet_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: sanitizeUser(user) };
}

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

module.exports = { register, login, JWT_SECRET };

