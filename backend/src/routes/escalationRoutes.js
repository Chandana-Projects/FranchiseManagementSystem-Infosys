const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/escalationController");

// GET  /api/escalations?limit=&offset=
router.get("/", controller.list);

// POST /api/escalations  — manual escalation trigger
router.post("/", controller.manualTrigger);

module.exports = router;
