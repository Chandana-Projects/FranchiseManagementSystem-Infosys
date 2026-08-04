const express = require("express");
const router = express.Router();
const { registerClient } = require("../services/sseService");

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  registerClient(res);

  res.write(": keep-alive\n\n");
});

module.exports = router;
