const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { full_name, email, password, role, outlet_id } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "full_name, email, and password are required" });
    }
    const user = await authService.register({ full_name, email, password, role, outlet_id });
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const { token, user } = await authService.login({ email, password });
    res.json({ token, user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || "Login failed" });
  }
}

module.exports = { register, login };
