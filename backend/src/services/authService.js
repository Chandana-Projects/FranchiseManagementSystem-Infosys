const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

async function register({ full_name, email, password, role, outlet_id }) {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("An account with this email already exists");
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);

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
}

async function login({ email, password }) {
  const user = await prisma.users.findUnique({ where: { email } });
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
    { user_id: user.user_id, email: user.email, role: user.role },
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
