const express = require("express");

const router = express.Router();

const {
    getVapidKey,
    subscribePush,
    sendPush
} = require("../controllers/pushController");

// Get VAPID public key
router.get("/vapid-key", getVapidKey);

// Subscribe browser for push notifications
router.post("/subscribe", subscribePush);

// Send push notification
router.post("/send", sendPush);

module.exports = router;