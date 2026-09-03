const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/notificationController");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management and tracking
 */

// GET  /api/notifications?outlet_id=&priority=&type=&channel=&resolved=&limit=&offset=
router.get("/", controller.list);

// GET  /api/notifications/stats  — must come before /:id routes
router.get("/stats", controller.getStats);

// POST /api/notifications
router.post("/", controller.create);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", controller.markRead);

// PATCH /api/notifications/:id/ack
router.patch("/:id/ack", controller.acknowledge);

module.exports = router;
