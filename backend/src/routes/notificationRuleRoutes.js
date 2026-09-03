const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/notificationRuleController");

// GET    /api/notification-rules
router.get("/",        controller.list);

// POST   /api/notification-rules
router.post("/",       controller.create);

// PATCH  /api/notification-rules/:id
router.patch("/:id",   controller.update);

// DELETE /api/notification-rules/:id
router.delete("/:id",  controller.remove);

module.exports = router;
